import random
import time
import os
import mimetypes
from datetime import datetime

from django.conf import settings
from django.utils.timezone import utc

from boto3.session import Session
from rest_framework.exceptions import ParseError

from storage.constants import MEDIUM_TYPE_PHOTO
from storage.constants import MEDIUM_TYPE_VIDEO
from storage.models import Medium


class MediumCreateMixin(object):
    def create_medium(self, url, type, mimetype):
        medium = Medium(url=url, type=type, mimetype=mimetype)
        medium.save()
        return medium


class MediumDeleteMixin(object):
    def delete_medium(self, medium):
        medium.deleted_at = datetime.utcnow().replace(tzinfo=utc)
        medium.save()


class MediumUploadMixin(MediumCreateMixin, MediumDeleteMixin):
    def upload_photo(self, file_obj, s3_folder, s3_filename):
        file_url, mimetype = self.upload(file_obj, s3_folder, s3_filename)
        medium = self.create_medium(file_url, MEDIUM_TYPE_PHOTO, mimetype)
        return medium

    def upload_video(self, file_obj, s3_folder, s3_filename):
        file_url, mimetype = self.upload(file_obj, s3_folder, s3_filename)
        medium = self.create_medium(file_url, MEDIUM_TYPE_VIDEO, mimetype)
        return medium

    def upload(self, file_obj, s3_folder, s3_filename):
        # Guess extension
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
