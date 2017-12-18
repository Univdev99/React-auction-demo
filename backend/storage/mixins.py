import random
import time
import os
import mimetypes
from datetime import datetime

from django.conf import settings
from django.utils.timezone import utc

from boto3.session import Session
from rest_framework.exceptions import ParseError

from storage.constants import MEDIUM_TYPE_IMAGE
from storage.constants import MEDIUM_TYPE_AUDIO
from storage.constants import MEDIUM_TYPE_VIDEO
from storage.constants import VALID_IMAGE_MIMETYPES
from storage.constants import VALID_AUDIO_MIMETYPES
from storage.constants import VALID_VIDEO_MIMETYPES
from storage.models import Medium


class MediumCreateMixin(object):
    # def create_medium(self, url, type, mimetype, content_object=None, order=1):
    def create_medium(self, **kwargs):
        return Medium.objects.create(**kwargs)


class MediumDeleteMixin(object):
    def delete_medium(self, medium):
        medium.content_object = None
        medium.deleted_at = datetime.utcnow().replace(tzinfo=utc)
        medium.save()


class MediumUploadMixin(MediumCreateMixin, MediumDeleteMixin):
    def is_mimetype_image(self, file_obj, raise_exception=True):
        if file_obj.content_type in VALID_IMAGE_MIMETYPES:
            return True
        if raise_exception:
            raise ParseError('Not supported image type')
        return False

    def upload_medium(self, file_obj, s3_folder, s3_filename, content_object=None, order=1):
        if file_obj.content_type in VALID_VIDEO_MIMETYPES:
            file_type = MEDIUM_TYPE_VIDEO
        elif file_obj.content_type in VALID_AUDIO_MIMETYPES:
            file_type = MEDIUM_TYPE_AUDIO
        elif file_obj.content_type in VALID_IMAGE_MIMETYPES:
            file_type = MEDIUM_TYPE_IMAGE
        else:
            raise ParseError('Invalid file mimetype')

        file_url, mimetype = self._upload_to_s3(file_obj, s3_folder, s3_filename)
        medium = self.create_medium(
            content_object=content_object,
            url=file_url,
            type=file_type,
            mimetype=mimetype,
            order=order
        )
        return medium

    def _mimetype_check(self, mimetype):
        """
        Some mimetypes are widely used but not correct, such as audio/mp3
        """
        mimetypes_for_check = {
            'audio/mp3': 'mp3',
            'image/jpeg': 'jpg',
            'image/png': 'png',
        }
        if mimetype in mimetypes_for_check:
            return mimetypes_for_check[mimetype]
        else:
            return None

    def _upload_to_s3(self, file_obj, s3_folder, s3_filename):
        # Guess extension
        extension = self._mimetype_check(file_obj.content_type)
        if not extension:
            extensions = mimetypes.guess_all_extensions(file_obj.content_type)
            if len(extensions) == 0:
                raise ParseError(detail='Unknown file type')
            extension = extensions.pop()

        # Save uploaded content to tmp file
        file_path = '{}/tmp_{}_{}_{}'.format(
            settings.TMP_DIR_PATH,
            self.tmp_file_prefix,
            int(time.time()),
            random.randint(10000000, 99999999)
        )
        destination = open(file_path, 'wb+')
        for chunk in file_obj.chunks():
            destination.write(chunk)
            destination.close()

        # Process uploaded file
        s3_file_location = '{}/{}{}'.format(s3_folder, s3_filename, extension)
        session = Session(
            aws_access_key_id=settings.AMAZON_S3_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AMAZON_S3_ACCESS_SECRET,
            region_name=settings.AMAZON_S3_REGION,
        )
        s3 = session.resource('s3')
        s3.Object(
            settings.AMAZON_S3_BUCKET,
            s3_file_location
        ).put(Body=open(file_path, 'rb'), ACL='public-read')

        # Delete tmp file
        os.remove(file_path)

        file_url = 'https://{}.s3-{}.amazonaws.com/{}'.format(
            settings.AMAZON_S3_BUCKET,
            settings.AMAZON_S3_REGION,
            s3_file_location
        )
        return file_url, file_obj.content_type
