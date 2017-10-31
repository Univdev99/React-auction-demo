from collections import namedtuple
from unittest.mock import patch

from django.test import TestCase

from storage.constants import MEDIUM_TYPE_IMAGE
from storage.constants import MEDIUM_TYPE_AUDIO
from storage.constants import MEDIUM_TYPE_VIDEO
from storage.mixins import MediumDeleteMixin
from storage.mixins import MediumUploadMixin
from storage.test.factories import MediumFactory


class MediumMixinsTests(TestCase):
    def get_dummy_file(self, mimetype):
        FileStruct = namedtuple('FileStruct', 'content_type')
        return FileStruct(content_type=mimetype)

    def test_upload_image(self):
        class DummyView(MediumUploadMixin):
            pass
        view = DummyView()
        mimetype = 'image/png'
        with patch.object(DummyView, '_upload_to_s3', return_value=('testurl', mimetype)) as mock_upload_to_s3:
            medium = view.upload_medium(self.get_dummy_file('image/png'), '', '')
            self.assertEqual(medium.type, MEDIUM_TYPE_IMAGE)
            self.assertEqual(medium.mimetype, mimetype)

    def test_upload_video(self):
        class DummyView(MediumUploadMixin):
            pass
        view = DummyView()
        mimetype = 'video/mp4'
        with patch.object(DummyView, '_upload_to_s3', return_value=('testurl', mimetype)) as mock_upload_to_s3:
            medium = view.upload_medium(self.get_dummy_file('video/mp4'), '', '')
            self.assertEqual(medium.type, MEDIUM_TYPE_VIDEO)
            self.assertEqual(medium.mimetype, mimetype)

    def test_upload_audio(self):
        class DummyView(MediumUploadMixin):
            pass
        view = DummyView()
        mimetype = 'audio/wav'
        with patch.object(DummyView, '_upload_to_s3', return_value=('testurl', mimetype)) as mock_upload_to_s3:
            medium = view.upload_medium(self.get_dummy_file('audio/wav'), '', '')
            self.assertEqual(medium.type, MEDIUM_TYPE_AUDIO)
            self.assertEqual(medium.mimetype, mimetype)

    def test_delete_medium(self):
        class DummyView(MediumDeleteMixin):
            pass
        view = DummyView()
        medium = MediumFactory.create()
        view.delete_medium(medium)
        self.assertNotEqual(medium.deleted_at, None)
