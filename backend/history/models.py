from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.contrib.postgres.fields import JSONField
from django.core.serializers.json import DjangoJSONEncoder

from history.constants import HISTORY_RECORD_ACTION_CHOICES


class HistoryRecordEntity(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey()

    class Meta:
        verbose_name_plural = 'HistoryRecordEntities'


class HistoryRecordManager(models.Manager):
    def create_history_record(self, subject, target, action, extra=None):
        if subject:
            subject_history_record_entity = HistoryRecordEntity()
            subject_history_record_entity.content_object = subject
            subject_history_record_entity.save()
        else:
            subject_history_record_entity = None

        if target:
            target_history_record_entity = HistoryRecordEntity()
            target_history_record_entity.content_object = target
            target_history_record_entity.save()
        else:
            target_history_record_entity = None

        return self.create(
            subject=subject_history_record_entity,
            target=target_history_record_entity,
            action=action,
            extra=extra
        )


class HistoryRecord(models.Model):
    subject = models.ForeignKey(
        HistoryRecordEntity,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='subject'
    )
    target = models.ForeignKey(
        HistoryRecordEntity,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='target'
    )
    action = models.CharField(
        max_length=50,
        choices=HISTORY_RECORD_ACTION_CHOICES,
    )
    extra = JSONField(encoder=DjangoJSONEncoder, null=True, blank=True, default=None)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = HistoryRecordManager()

    def __str__(self):
        model_str = 'HistoryRecord <{}> on {}'.format(self.action, str(self.target.content_object))
        if self.subject:
            model_str += ' by {}'.format(self.subject.content_object)
        return model_str

    @property
    def action_type(self):
        sep_pos = self.action.find('/')
        if sep_pos >= 0:
            return self.action[0:sep_pos]
        return self.action
