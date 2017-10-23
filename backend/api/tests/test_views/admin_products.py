import json
from unittest.mock import MagicMock, patch

from common.test import AdminTestCase
from django.urls import reverse

from rest_framework import status

from entity.models import ProductMedium
from entity.test.factories import ProductFactory
from storage.constants import MEDIUM_TYPE_VIDEO
from storage.test.factories import MediumFactory


class ProductDetailViewTests(AdminTestCase):
    def setUp(self):
        super(ProductDetailViewTests, self).setUp()
        self.product = ProductFactory.create()
        self.medium = MediumFactory.create()
        pm = ProductMedium.objects.create(product=self.product, medium=self.medium, order=1)

    def test_delete_product(self):
        response = self.client.delete(
            reverse('api:admin:product-detail', kwargs=dict(pk=self.product.pk))
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.medium.refresh_from_db()
        self.assertNotEqual(self.medium.deleted_at, None)


class ProductMediumUploadViewTests(AdminTestCase):
    def setUp(self):
        super(ProductMediumUploadViewTests, self).setUp()
        self.product = ProductFactory.create()

    @patch('api.views.admin.products.ProductMediumUploadView.get_uploaded_file')
    @patch('api.views.admin.products.MediumUploadMixin.upload_image')
    def test_upload_medium(self, mock_upload_image, mock_get_uploaded_file):
        new_medium = MediumFactory.create()
        mock_upload_image.return_value = new_medium

        file = MagicMock()
        file.content_type = 'image/png'
        mock_get_uploaded_file.return_value = file

        response = self.client.post(
            reverse('api:admin:product-medium', kwargs=dict(pk=self.product.pk))
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertNotEqual(self.product.productmedium_set.count(), 0)


class ProductMediumDeleteViewTests(AdminTestCase):
    def setUp(self):
        super(ProductMediumDeleteViewTests, self).setUp()
        self.product = ProductFactory.create()
        self.medium = MediumFactory.create()
        self.pm = ProductMedium.objects.create(product=self.product, medium=self.medium, order=1)

    def test_delete_medium(self):
        response = self.client.delete(
            reverse('api:admin:product-medium-delete', kwargs=dict(pk=self.product.pk, pm_pk=self.pm.pk))
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.medium.refresh_from_db()
        self.assertNotEqual(self.medium.deleted_at, None)
