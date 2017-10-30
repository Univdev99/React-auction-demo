import json
from unittest.mock import MagicMock, patch

from common.test import AdminTestCase
from django.urls import reverse

from rest_framework import status

from account.test.factories import UserFactory


class UserBlockUnblockViewTests(AdminTestCase):
    def setUp(self):
        super(UserBlockUnblockViewTests, self).setUp()
        self.user = UserFactory.create()

    def test_block_user(self):
        self.user.is_active = False
        self.user.save()

        data = {'block': True}
        response = self.client.put(
            reverse('api:admin:user-block-unblock', kwargs=dict(pk=self.user.pk)),
            data
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertFalse(self.user.is_active)

    def test_unblock_user(self):
        data = {'block': False}
        response = self.client.put(
            reverse('api:admin:user-block-unblock', kwargs=dict(pk=self.user.pk)),
            data
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertTrue(self.user.is_active)
