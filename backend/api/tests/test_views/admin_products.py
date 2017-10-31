import json
from unittest.mock import MagicMock, patch

from common.test import AdminTestCase
from django.urls import reverse

from rest_framework import status

from api.serializers.entities import ProductSerializer
from entity.models import Product
from entity.test.factories import DonorFactory
from entity.test.factories import ProductFactory
from storage.constants import MEDIUM_TYPE_VIDEO
from storage.test.factories import MediumFactory


class ProductListViewTests(AdminTestCase):
    def setUp(self):
        super(ProductListViewTests, self).setUp()
        self.donor = DonorFactory.create()

    def get_data(self):
        return {
            'title': 'Test',
            'description': 'Test description.',
            'donor': self.donor.pk,
            'tagnames': ['tag1', 'tag2'],
        }

    def test_create_product_with_tags(self):
        data = self.get_data()
        response = self.client.post(
            reverse('api:admin:product-list'),
            data
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        product = Product.objects.first()
        self.assertNotEqual(product, None)
        self.assertEqual(product.tagnames, ['tag1', 'tag2'])


class ProductDetailViewTests(AdminTestCase):
    def setUp(self):
        super(ProductDetailViewTests, self).setUp()
        self.product = ProductFactory.create()
        self.medium = MediumFactory.create(instance=self.product, order=1)

    def test_update_product_with_tags(self):
        serializer = ProductSerializer(self.product)
        data = serializer.data
        data['tagnames'] = ['tag1', 'tag2']

        response = self.client.put(
            reverse('api:admin:product-detail', kwargs=dict(pk=self.product.pk)),
            data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.product.tagnames, ['tag1', 'tag2'])

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
    @patch('api.views.admin.products.MediumUploadMixin.upload_medium')
    def test_upload_medium(self, mock_upload_medium, mock_get_uploaded_file):
        new_medium = MediumFactory.create(instance=self.product)
        mock_upload_medium.return_value = new_medium

        file = MagicMock()
        file.content_type = 'image/png'
        mock_get_uploaded_file.return_value = file

        response = self.client.post(
            reverse('api:admin:product-medium', kwargs=dict(pk=self.product.pk))
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertNotEqual(self.product.media.count(), 0)


class ProductMediumDeleteViewTests(AdminTestCase):
    def setUp(self):
        super(ProductMediumDeleteViewTests, self).setUp()
        self.product = ProductFactory.create()
        self.medium = MediumFactory.create(instance=self.product, )

    def test_delete_medium(self):
        response = self.client.delete(
            reverse('api:admin:product-medium-delete', kwargs=dict(pk=self.product.pk, pm_pk=self.medium.pk))
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.medium.refresh_from_db()
        self.assertNotEqual(self.medium.deleted_at, None)


class ProductMediaReorderViewTests(AdminTestCase):
    def setUp(self):
        super(ProductMediaReorderViewTests, self).setUp()
        self.product = ProductFactory.create()
        self.media = (
            MediumFactory.create(instance=self.product, order=1),
            MediumFactory.create(instance=self.product, order=2),
            MediumFactory.create(instance=self.product, order=3),
        )

    def test_media_reorder_performs_correct(self):
        reordered_pks = [
            self.media[0].pk,
            self.media[2].pk,
            self.media[1].pk,
        ]
        response = self.client.post(
            reverse('api:admin:product-media-reorder', kwargs=dict(
                pk=self.product.pk
            )),
            dict(media_order=reordered_pks)
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        dms = self.product.media.order_by('order')
        self.assertEqual(dms[0].pk, reordered_pks[0])
        self.assertEqual(dms[1].pk, reordered_pks[1])
        self.assertEqual(dms[2].pk, reordered_pks[2])

    def test_media_reorder_response(self):
        reordered_pks = [
            self.media[0].pk,
            self.media[2].pk,
            self.media[1].pk,
        ]
        response = self.client.post(
            reverse('api:admin:product-media-reorder', kwargs=dict(
                pk=self.product.pk
            )),
            dict(media_order=reordered_pks)
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = json.loads(response.content)
        self.assertEqual(data[0]['pk'], reordered_pks[0])
        self.assertEqual(data[1]['pk'], reordered_pks[1])
        self.assertEqual(data[2]['pk'], reordered_pks[2])
