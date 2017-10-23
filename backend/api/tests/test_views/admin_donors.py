import json
from unittest.mock import MagicMock, patch

from common.test import AdminTestCase
from django.urls import reverse

from rest_framework import status

from entity.models import DonorMedium
from entity.test.factories import DonorFactory
from storage.constants import MEDIUM_TYPE_VIDEO
from storage.test.factories import MediumFactory


class DonorDetailViewTests(AdminTestCase):
    def setUp(self):
        super(DonorDetailViewTests, self).setUp()
        self.donor = DonorFactory.create()
        self.medium = MediumFactory.create()
        dm = DonorMedium.objects.create(donor=self.donor, medium=self.medium, order=1)

    def test_delete_donor(self):
        response = self.client.delete(
            reverse('api:admin:donor-detail', kwargs=dict(pk=self.donor.pk))
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.medium.refresh_from_db()
        self.assertNotEqual(self.medium.deleted_at, None)


class DonorMediumUploadViewTests(AdminTestCase):
    def setUp(self):
        super(DonorMediumUploadViewTests, self).setUp()
        self.donor = DonorFactory.create()

    @patch('api.views.admin.donors.DonorMediumUploadView.get_uploaded_file')
    @patch('api.views.admin.donors.MediumUploadMixin.upload_image')
    def test_upload_medium(self, mock_upload_image, mock_get_uploaded_file):
        new_medium = MediumFactory.create()
        mock_upload_image.return_value = new_medium

        file = MagicMock()
        file.content_type = 'image/png'
        mock_get_uploaded_file.return_value = file

        response = self.client.post(
            reverse('api:admin:donor-medium', kwargs=dict(pk=self.donor.pk))
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertNotEqual(self.donor.donormedium_set.count(), 0)


class DonorMediumDeleteViewTests(AdminTestCase):
    def setUp(self):
        super(DonorMediumDeleteViewTests, self).setUp()
        self.donor = DonorFactory.create()
        self.medium = MediumFactory.create()
        self.dm = DonorMedium.objects.create(donor=self.donor, medium=self.medium, order=1)

    def test_delete_medium(self):
        response = self.client.delete(
            reverse('api:admin:donor-medium-delete', kwargs=dict(pk=self.donor.pk, dm_pk=self.dm.pk))
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.medium.refresh_from_db()
        self.assertNotEqual(self.medium.deleted_at, None)


class DonorMediaReorderViewTests(AdminTestCase):
    def setUp(self):
        super(DonorMediaReorderViewTests, self).setUp()
        self.donor = DonorFactory.create()
        self.donorMedia = (
            DonorMedium.objects.create(donor=self.donor, medium=MediumFactory.create(), order=1),
            DonorMedium.objects.create(donor=self.donor, medium=MediumFactory.create(), order=2),
            DonorMedium.objects.create(donor=self.donor, medium=MediumFactory.create(), order=3),
        )

    def test_media_reorder_performs_correct(self):
        reordered_pks = [
            self.donorMedia[0].pk,
            self.donorMedia[2].pk,
            self.donorMedia[1].pk,
        ]
        response = self.client.post(
            reverse('api:admin:donor-media-reorder', kwargs=dict(
                pk=self.donor.pk
            )),
            dict(media_order=reordered_pks)
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        dms = self.donor.donormedium_set.order_by('order')
        self.assertEqual(dms[0].pk, reordered_pks[0])
        self.assertEqual(dms[1].pk, reordered_pks[1])
        self.assertEqual(dms[2].pk, reordered_pks[2])

    def test_media_reorder_response(self):
        reordered_pks = [
            self.donorMedia[0].pk,
            self.donorMedia[2].pk,
            self.donorMedia[1].pk,
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
