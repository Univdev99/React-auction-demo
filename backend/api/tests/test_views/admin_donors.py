import json
from unittest.mock import patch

from common.test import AdminTestCase
from django.urls import reverse

from rest_framework import status

from entity.test.factories import DonorFactory
from storage.constants import MEDIUM_TYPE_VIDEO
from storage.test.factories import MediumFactory


class DonorDetailViewTests(AdminTestCase):
    def setUp(self):
        super(DonorDetailViewTests, self).setUp()
        self.donor = DonorFactory.create()

    def test_delete_donor(self):
        response = self.client.delete(
            reverse('api:admin:donor-detail', kwargs=dict(pk=self.donor.pk))
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.donor.logo.refresh_from_db()
        self.assertNotEqual(self.donor.logo.deleted_at, None)


class DonorLogoUploadViewTests(AdminTestCase):
    def setUp(self):
        super(DonorLogoUploadViewTests, self).setUp()
        self.donor = DonorFactory.create()

    @patch('api.views.admin.donor.UploadImageSerializer.is_valid', return_value=True)
    @patch('api.views.admin.donor.UploadImageSerializer.validated_data')
    @patch('api.views.admin.donor.MediumUploadMixin.upload_image')
    def test_upload_logo(self, mock_upload_image, mock_validated_data, mock_is_valid):
        new_logo = MediumFactory.create()
        old_logo = self.donor.logo
        mock_upload_image.return_value = new_logo

        response = self.client.put(
            reverse('api:admin:donor-logo', kwargs=dict(pk=self.donor.pk))
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        old_logo.refresh_from_db()
        self.assertNotEqual(old_logo.deleted_at, None)

        self.donor.refresh_from_db()
        self.assertEqual(self.donor.logo.pk, new_logo.pk)

    @patch('api.views.admin.donor.UploadVideoSerializer.is_valid', return_value=True)
    @patch('api.views.admin.donor.UploadVideoSerializer.validated_data')
    @patch('api.views.admin.donor.MediumUploadMixin.upload_video')
    def test_upload_video(self, mock_upload_video, mock_validated_data, mock_is_valid):
        new_video = MediumFactory.create(type=MEDIUM_TYPE_VIDEO, mimetype='video/mp4')
        old_video = self.donor.video
        mock_upload_video.return_value = new_video

        response = self.client.put(
            reverse('api:admin:donor-video', kwargs=dict(pk=self.donor.pk))
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        old_video.refresh_from_db()
        self.assertNotEqual(old_video.deleted_at, None)

        self.donor.refresh_from_db()
        self.assertEqual(self.donor.video.pk, new_video.pk)
