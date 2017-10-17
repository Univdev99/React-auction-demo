import json
from unittest.mock import patch

from common.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework import status

from account.models import UserVerification


class SignUpTests(TestCase):
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


class CurrentUserTests(TestCase):
    def get_user_data(self):
        return {
            'username': 'test',
            'email': 'test@test.com',
            'first_name': 'Test',
            'last_name': 'Tester',
            'password': 'abcde123',
        }

    def setUp(self):
        super(CurrentUserTests, self).setUp()
        user_data = self.get_user_data()
        password = user_data.pop('password')
        self.user = get_user_model().objects.create(**user_data)
        self.user.set_password(password)
        self.user.save()
        self.client.login(username=self.user.username, password=password)

    def test_get_current_user(self):
        response = self.client.get(reverse('api:current-user'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user_data = self.get_user_data()
        response_data = json.loads(response.content)
        self.assertEqual(response_data['username'], user_data['username'])

    def test_put_current_user(self):
        new_data = {
            'username': 'test1',
            'first_name': 'Test1',
            'last_name': 'Tester1',
            'password': 'abcdef123',
            'password_confirm': 'abcdef123',
        }
        response = self.client.put(reverse('api:current-user'), new_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, new_data['username'])
        self.assertEqual(self.client.login(
            username=self.user.username,
            password=new_data['password']
        ), True)

    def test_put_current_user_with_password_unchanged(self):
        new_data = {
            'username': 'test1',
            'first_name': 'Test1',
            'last_name': 'Tester1',
        }
        response = self.client.put(reverse('api:current-user'), new_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.content)
