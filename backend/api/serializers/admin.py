from rest_framework import serializers

from entity.models import Donor
from entity.models import Charity


class DonorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donor
        fields = ('pk', 'title', 'description', 'type', 'charity')
        read_only_fields = ('pk',)


class CharitySerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()

    class Meta:
        model = Charity
        fields = ('pk', 'title', 'description', 'logo')
        read_only_fields = ('pk',)

    def get_logo(self, obj):
        return obj.logo.url if obj.logo else None


class UploadLogoSerializer(serializers.Serializer):
    file = serializers.ImageField(max_length=1024 * 1024 * 2)
