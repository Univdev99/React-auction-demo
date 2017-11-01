import json
from unittest.mock import patch

from common.test import AdminAPITestCase
from django.urls import reverse

from rest_framework import status

from entity.test.factories import CharityFactory
from storage.test.factories import MediumFactory


class CharityDetailViewTests(AdminAPITestCase):
    def setUp(self):
        super(CharityDetailViewTests, self).setUp()
        self.charity = CharityFactory.create()

    def test_delete_charity(self):
        response = self.client.delete(
            reverse('api:admin:charity-detail', kwargs=dict(pk=self.charity.pk))
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.charity.logo.refresh_from_db()
        self.assertNotEqual(self.charity.logo.deleted_at, None)


class CharityLogoUploadViewTests(AdminAPITestCase):
    def setUp(self):
        super(CharityLogoUploadViewTests, self).setUp()
        self.charity = CharityFactory.create()

    @patch('api.views.admin.charities.UploadMediumSerializer.is_valid', return_value=True)
    @patch('api.views.admin.charities.UploadMediumSerializer.validated_data')
    @patch('api.views.admin.charities.MediumUploadMixin.is_mimetype_image')
    @patch('api.views.admin.charities.MediumUploadMixin.upload_medium')
    def test_upload_logo(self, mock_upload_medium, mock_is_mimetype_image, mock_validated_data, mock_is_valid):
        new_logo = MediumFactory.create()
        old_logo = self.charity.logo
        mock_upload_medium.return_value = new_logo

        response = self.client.put(
            reverse('api:admin:charity-logo', kwargs=dict(pk=self.charity.pk))
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        old_logo.refresh_from_db()
        self.assertNotEqual(old_logo.deleted_at, None)

        self.charity.refresh_from_db()
        self.assertEqual(self.charity.logo.pk, new_logo.pk)
