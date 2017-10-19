from unittest.mock import patch

from django.test import TestCase

from storage.constants import MEDIUM_TYPE_PHOTO
from storage.constants import MEDIUM_TYPE_VIDEO
from storage.mixins import MediumDeleteMixin
from storage.mixins import MediumUploadMixin
from storage.test.factories import MediumFactory


class MediumMixinsTests(TestCase):
    def test_upload_image(self):
        class DummyView(MediumUploadMixin):
            pass
        view = DummyView()
        mimetype = 'image/png'
        with patch.object(DummyView, 'upload_to_s3', return_value=('testurl', mimetype)) as mock_upload_to_s3:
            medium = view.upload_image(None, '', '')
            self.assertEqual(medium.type, MEDIUM_TYPE_PHOTO)
            self.assertEqual(medium.mimetype, mimetype)

    def test_upload_video(self):
        class DummyView(MediumUploadMixin):
            pass
        view = DummyView()
        mimetype = 'video/mp4'
        with patch.object(DummyView, 'upload_to_s3', return_value=('testurl', mimetype)) as mock_upload_to_s3:
            medium = view.upload_video(None, '', '')
            self.assertEqual(medium.type, MEDIUM_TYPE_VIDEO)
            self.assertEqual(medium.mimetype, mimetype)

    def test_delete_medium(self):
        class DummyView(MediumDeleteMixin):
            pass
        view = DummyView()
        medium = MediumFactory.create()
        view.delete_medium(medium)
        self.assertNotEqual(medium.deleted_at, None)
