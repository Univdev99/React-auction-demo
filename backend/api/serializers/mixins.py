from django.db import transaction

from rest_framework import serializers
from tagging.models import Tag


class TagnamesSerializerMixin(object):
    def __init__(self, *args, **kwargs):
        super(TagnamesSerializerMixin, self).__init__(*args, **kwargs)

        self.Meta.fields = self.Meta.fields + ('tagnames',)
        self.fields['tagnames'] = serializers.ListField(
            child=serializers.CharField()
        )

    @transaction.atomic
    def create(self, validated_data):
        tagnames = validated_data.pop('tagnames')
        instance = super(TagnamesSerializerMixin, self).create(validated_data)
        Tag.objects.update_tags(instance, ','.join(tagnames))
        return instance

    @transaction.atomic
    def update(self, instance, validated_data):
        tagnames = validated_data.pop('tagnames')
        instance = super(TagnamesSerializerMixin, self).update(instance, validated_data)
        Tag.objects.update_tags(instance, ','.join(tagnames))
        return instance
