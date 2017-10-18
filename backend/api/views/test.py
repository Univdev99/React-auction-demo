from django.conf import settings

from boto3.session import Session
from rest_framework import views
from rest_framework.response import Response


class TestView(views.APIView):
    def get(self, *args, **kwargs):
        tmp_file = '{}/tmp_downloaded_from_s3'.format(
            settings.TMP_DIR_PATH
        )

        session = Session(
            aws_access_key_id=settings.AMAZON_S3_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AMAZON_S3_ACCESS_SECRET,
            region_name=settings.AMAZON_S3_REGION,
        )
        s3 = session.resource('s3')
        s3.Bucket(settings.AMAZON_S3_BUCKET).download_file(
            'charity/logo/test.png',
            tmp_file
        )

        return Response({
            'success': True,
        })
