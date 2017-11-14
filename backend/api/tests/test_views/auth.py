import json
from unittest.mock import patch

from common.test import APITestCase
from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework import status

from account.models import UserVerification


class SignUpTests(APITestCase):
    def get_data(self):
        return {
            'email': 'tester1@test.com',
            'first_name': 'tester1',
            'last_name': 'test',
            'password': 'abcde123',
        }

    def test_signup(self):
        data = self.get_data()
        response = self.client.post(reverse('api:signup'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = get_user_model().objects.get(email=data['email'])
        self.assertNotEqual(user, None)

    def test_signup_verification(self):
        data = self.get_data()
        response = self.client.post(reverse('api:signup'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        user = get_user_model().objects.select_related('userverification').get(email=data['email'])
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
        user = get_user_model().objects.get(email='test@test.com')
        self.assertEqual(user.email, 'test@test.com')
        self.assertEqual(user.first_name, 'TestFirst')
        self.assertEqual(user.last_name, 'TestLast')


class CurrentUserTests(APITestCase):
    def get_user_data(self):
        return {
            'email': 'tester@test.com',
            'username': 'tester',
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
        self.client.logout()
        self.client.login(email=self.user.email, password=password)

    def test_get_current_user(self):
        response = self.client.get(reverse('api:current-user'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user_data = self.get_user_data()
        response_data = json.loads(response.content)
        self.assertEqual(response_data['email'], user_data['email'])

    def test_put_current_user(self):
        new_data = {
            'email': 'test@test.com',
            'username': 'testuser',
            'first_name': 'tester1',
            'last_name': 'Tester1',
            'address_line': 'New Address',
            'city': 'New York',
            'country': 'US',
            'phone_number': '+1 (415) 412-4233',
            'zipcode': '10011'
        }
        response = self.client.put(reverse('api:current-user'), new_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.email, new_data['email'])
        self.assertEqual(self.user.username, new_data['username'])
        self.assertEqual(self.user.address_line, new_data['address_line'])
        self.assertEqual(self.user.city, new_data['city'])
        self.assertEqual(self.user.country, new_data['country'])
        self.assertEqual(self.user.phone_number, new_data['phone_number'])
        self.assertEqual(self.user.zipcode, new_data['zipcode'])
