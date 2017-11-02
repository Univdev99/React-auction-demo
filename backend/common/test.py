from unittest.mock import patch, MagicMock

from django import test

from rest_framework.test import APIClient
from rest_framework.test import APIRequestFactory

from account.test.factories import AdminFactory
from account.test.factories import UserFactory


class APITestCase(test.TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = UserFactory.create()
        self.client.force_authenticate(user=self.user)


class AdminAPITestCase(test.TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = AdminFactory.create()
        self.client.force_authenticate(user=self.user)


class APISerializerTestCase(test.TestCase):
    """
    TestCase mixin for writing API serializer tests.
    """
    serializer_class = None

    def setUp(self):
        super(APISerializerTestCase, self).setUp()
        self.user = None

    def get_request(self, user=None, method='get', path='/', data=None):
        factory = APIRequestFactory()
        factory_method = getattr(factory, method)
        request = factory_method(path, data)
        request.user = user
        return request

    def get_serializer(self, *args, **kwargs):
        serializer_class = kwargs.pop('serializer_class', self.serializer_class)
        user = kwargs.pop('user', self.user)
        model_object = kwargs.pop('model_object', None)

        context = kwargs.setdefault('context', {})
        context.setdefault('request', self.get_request(user=user))

        view = MagicMock()
        view.get_object.return_value = model_object
        context.setdefault('view', view)

        if serializer_class is None:
            raise ValueError(
                "{} requires a `serializer_class`".format(type(self).__name__))

        return serializer_class(*args, **kwargs)

    def assertValid(self, serializer):
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def assertInvalid(self, serializer):
        self.assertFalse(serializer.is_valid())
