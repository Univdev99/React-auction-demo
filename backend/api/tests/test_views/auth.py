import json
from unittest.mock import patch

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

    @patch('api.views.auth.GraphAPI.get_object', return_value={
        'id': 1234567890,
        'first_name': 'TestFirst',
        'last_name': 'TestLast',
        'email': 'test@test.com'
    })
    def test_signup_with_facebook(self, mock):
        data = self.get_data()
        data.pop('email')
        data['access_token'] = 'any_string_for_mock_acces_token'
        response = self.client.post(reverse('api:signup-with-facebook'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = get_user_model().objects.get(username=data['username'])
        self.assertEqual(user.email, 'test@test.com')
        self.assertEqual(user.first_name, 'TestFirst')
        self.assertEqual(user.last_name, 'TestLast')
