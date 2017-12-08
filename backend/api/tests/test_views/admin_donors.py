import json
from unittest.mock import MagicMock, patch

from common.test import AdminAPITestCase
from django.urls import reverse

from rest_framework import status

from api.serializers.entities import DonorSerializer
from entity.constants import DONOR_TYPE_COMPANY
from entity.models import Donor
from entity.test.factories import CharityFactory
from entity.test.factories import DonorFactory
from storage.constants import MEDIUM_TYPE_VIDEO
from storage.test.factories import MediumFactory


class DonorListViewTests(AdminAPITestCase):
    def setUp(self):
        super(DonorListViewTests, self).setUp()
        self.charity = CharityFactory.create()

    def get_data(self):
        return {
            'title': 'Test',
            'description': 'Test description.',
            'type': DONOR_TYPE_COMPANY,
            'charity': self.charity.pk,
            'tagnames': ['tag1', 'tag2'],
        }

    def test_create_donor_with_tags(self):
        data = self.get_data()
        response = self.client.post(
            reverse('api:admin:donor-list'),
            data
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        donor = Donor.objects.first()
        self.assertNotEqual(donor, None)
        self.assertEqual(donor.tagnames, ['tag1', 'tag2'])


class DonorDetailViewTests(AdminAPITestCase):
    def setUp(self):
        super(DonorDetailViewTests, self).setUp()
        self.donor = DonorFactory.create()
        self.medium = MediumFactory.create(instance=self.donor)

    def test_update_donor_with_tags(self):
        serializer = DonorSerializer(self.donor)
        data = serializer.data
        data['website'] = ''
        data['tagnames'] = ['tag1', 'tag2']

        response = self.client.put(
            reverse('api:admin:donor-detail', kwargs=dict(pk=self.donor.pk)),
            data
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.content)
        self.assertEqual(self.donor.tagnames, ['tag1', 'tag2'])

    def test_delete_donor(self):
        response = self.client.delete(
            reverse('api:admin:donor-detail', kwargs=dict(pk=self.donor.pk))
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.medium.refresh_from_db()
        self.assertNotEqual(self.medium.deleted_at, None)


class DonorMediumUploadViewTests(AdminAPITestCase):
    def setUp(self):
        super(DonorMediumUploadViewTests, self).setUp()
        self.donor = DonorFactory.create()

    @patch('api.views.admin.donors.DonorMediumUploadView.get_uploaded_file')
    @patch('api.views.admin.donors.MediumUploadMixin.upload_medium')
    def test_upload_medium(self, mock_upload_medium, mock_get_uploaded_file):
        new_medium = MediumFactory.create(self.donor)
        mock_upload_medium.return_value = new_medium

        file = MagicMock()
        file.content_type = 'image/png'
        mock_get_uploaded_file.return_value = file

        response = self.client.post(
            reverse('api:admin:donor-medium', kwargs=dict(pk=self.donor.pk))
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertNotEqual(self.donor.media.count(), 0)


class DonorMediumDeleteViewTests(AdminAPITestCase):
    def setUp(self):
        super(DonorMediumDeleteViewTests, self).setUp()
        self.donor = DonorFactory.create()
        self.medium = MediumFactory.create(instance=self.donor)

    def test_delete_medium(self):
        response = self.client.delete(
            reverse('api:admin:donor-medium-delete', kwargs=dict(pk=self.donor.pk, dm_pk=self.medium.pk))
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.medium.refresh_from_db()
        self.assertNotEqual(self.medium.deleted_at, None)


class DonorMediaReorderViewTests(AdminAPITestCase):
    def setUp(self):
        super(DonorMediaReorderViewTests, self).setUp()
        self.donor = DonorFactory.create()
        self.media = (
            MediumFactory.create(instance=self.donor, order=1),
            MediumFactory.create(instance=self.donor, order=2),
            MediumFactory.create(instance=self.donor, order=3),
        )

    def test_media_reorder_performs_correct(self):
        reordered_pks = [
            self.media[0].pk,
            self.media[2].pk,
            self.media[1].pk,
        ]
        response = self.client.post(
            reverse('api:admin:donor-media-reorder', kwargs=dict(
                pk=self.donor.pk
            )),
            dict(media_order=reordered_pks)
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        dms = self.donor.media.order_by('order')
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
            reverse('api:admin:donor-media-reorder', kwargs=dict(
                pk=self.donor.pk
            )),
            dict(media_order=reordered_pks)
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = json.loads(response.content)
        self.assertEqual(data[0]['pk'], reordered_pks[0])
        self.assertEqual(data[1]['pk'], reordered_pks[1])
        self.assertEqual(data[2]['pk'], reordered_pks[2])
