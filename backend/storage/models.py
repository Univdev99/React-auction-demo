from django.db import models

from storage.constants import MEDIUM_TYPE_CHOICES


class Medium(models.Model):
    url = models.URLField(max_length=300)
    type = models.CharField(choices=MEDIUM_TYPE_CHOICES, max_length=50)
    mimetype = models.CharField(max_length=30)
    deleted_at = models.DateTimeField(null=True, default=None)

    class Meta:
        verbose_name_plural = 'Media'

    def __unicode__(self):
        return u'Medium {} ({})'.format(self.pk, self.type)
