from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

from storage.constants import MEDIUM_TYPE_CHOICES


class Medium(models.Model):
    url = models.URLField(max_length=300)
    type = models.CharField(choices=MEDIUM_TYPE_CHOICES, max_length=50)
    mimetype = models.CharField(max_length=30)
    deleted_at = models.DateTimeField(null=True, default=None)

    order = models.PositiveIntegerField(default=1)

    content_type = models.ForeignKey(ContentType, null=True, blank=True, on_delete=models.SET_NULL)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey()

    class Meta:
        verbose_name_plural = 'Media'

    def __str__(self):
        return 'Medium {} ({})'.format(self.pk, self.type)
