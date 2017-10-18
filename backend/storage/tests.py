from django.test import TestCase

from storage.mixins import MediumDeleteMixin
from storage.test.factories import MediumFactory


class MediumMixinsTests(TestCase):
    def test_delete_medium(self):
        class DummyView(MediumDeleteMixin):
            pass
        view = DummyView()
        medium = MediumFactory.create()
        view.delete_medium(medium)
        self.assertNotEqual(medium.deleted_at, None)
