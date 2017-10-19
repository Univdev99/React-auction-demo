from rest_framework import serializers

from entity.models import Donor
from entity.models import Charity


class CharitySerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()

    class Meta:
        model = Charity
        fields = ('pk', 'title', 'description', 'logo')
        read_only_fields = ('pk',)

    def get_logo(self, obj):
        return obj.logo.url if obj.logo else None


class DonorSerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()
    video = serializers.SerializerMethodField()
    # charity = CharitySerializer(read_only=True)

    class Meta:
        model = Donor
        fields = ('pk', 'title', 'description', 'type', 'logo', 'video', 'charity')
        read_only_fields = ('pk',)

    def get_logo(self, obj):
        return obj.logo.url if obj.logo else None

    def get_video(self, obj):
        return obj.logo.url if obj.logo else None
