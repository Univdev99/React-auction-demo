import json

from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from account.models import UserVerification


class SignUpTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def get_data(self):
        return {
            'username': 'test1',
            'email': 'test1@test.com',
            'password': 'abcde123',
            'password_confirm': 'abcde123',
        }

    def test_signup(self):
        data = self.get_data()
        response = self.client.post(reverse('api:signup'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = get_user_model().objects.get(username=data['username'])
        self.assertNotEqual(user, None)

    def test_signup_verification(self):
        data = self.get_data()
        response = self.client.post(reverse('api:signup'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        user = get_user_model().objects.select_related('userverification').get(username=data['username'])
        response = self.client.post(reverse('api:verify-signup'), dict(token=user.userverification.token))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertEqual(user.is_active, True)
