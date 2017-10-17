from django import test

from rest_framework.test import APIClient


class TestCase(test.TestCase):
    def setUp(self):
        self.client = APIClient()
