from rest_framework import serializers

from storage.constants import VALID_IMAGE_MIMETYPES
from storage.constants import VALID_AUDIO_MIMETYPES
from storage.constants import VALID_VIDEO_MIMETYPES
from storage.models import Medium


class MediumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medium
        fields = ('pk', 'url', 'type', 'mimetype', 'order', 'created_at', 'deleted_at')
        read_only_fields = ('pk', 'url', 'type', 'mimetype', 'order', 'created_at', 'deleted_at')


class UploadMediumSerializer(serializers.Serializer):
    file = serializers.FileField(max_length=1024 * 1024 * 30)

    def validate_file(self, value):
        if (value.content_type not in VALID_IMAGE_MIMETYPES and
                value.content_type not in VALID_AUDIO_MIMETYPES and
                value.content_type not in VALID_VIDEO_MIMETYPES):
            raise serializers.ValidationError('Not supported image or video type')
        return value
