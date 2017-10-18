from rest_framework import serializers

from entity.models import Donor
from entity.models import Charity


class DonorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donor
        fields = ('pk', 'title', 'description', 'type', 'charity')


class CharitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Charity
        fields = ('pk', 'title', 'description')
