from rest_framework import serializers

from storage.constants import VALID_IMAGE_MIMETYPES
from storage.constants import VALID_AUDIO_MIMETYPES
from storage.constants import VALID_VIDEO_MIMETYPES
from storage.models import Medium


class MediumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medium
        fields = ('pk', 'url', 'type', 'embed', 'mimetype', 'order', 'created_at', 'deleted_at')
        read_only_fields = ('pk', 'url', 'type', 'embed', 'mimetype', 'order', 'created_at', 'deleted_at')


class UploadMediumSerializer(serializers.Serializer):
    file = serializers.FileField(max_length=1024 * 1024 * 30, required=False)
    embed = serializers.CharField(required=False)

    def validate_file(self, value):
        if (
            value and
            value.content_type not in VALID_IMAGE_MIMETYPES and
            value.content_type not in VALID_AUDIO_MIMETYPES and
            value.content_type not in VALID_VIDEO_MIMETYPES
        ):
            raise serializers.ValidationError('Not supported image or video type')
        return value

    def validate(self, data):
        data = super(UploadMediumSerializer, self).validate(data)

        if 'file' not in data and 'embed' not in data:
            raise serializers.ValidationError('Neither file was uploaded nor embedded medium was created')

        return data
