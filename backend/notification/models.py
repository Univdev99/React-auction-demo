from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.contrib.postgres.fields import JSONField
from django.core.serializers.json import DjangoJSONEncoder

from notification.constants import NOTIFICATION_CONTENT_CHOICES


class NotificationEntity(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey()

    class Meta:
        verbose_name_plural = 'NotificationEntities'


class NotificationManager(models.Manager):
    def create_notification(self, subject, target, action, extra=None):
        if subject:
            subject_notification_entity = NotificationEntity()
            subject_notification_entity.content_object = subject
            subject_notification_entity.save()
        else:
            subject_notification_entity = None

        target_notification_entity = NotificationEntity()
        target_notification_entity.content_object = target
        target_notification_entity.save()

        return self.create(
            subject=subject_notification_entity,
            target=target_notification_entity,
            action=action,
            extra=extra
        )


class Notification(models.Model):
    subject = models.ForeignKey(
        NotificationEntity,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='subject'
    )
    target = models.ForeignKey(NotificationEntity, on_delete=models.CASCADE, related_name='target')
    action = models.CharField(
        max_length=50,
        choices=NOTIFICATION_CONTENT_CHOICES,
    )
    extra = JSONField(encoder=DjangoJSONEncoder, null=True, blank=True, default=None)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = NotificationManager()

    def __str__(self):
        model_str = 'Notification <{}> on {}'.format(self.action, str(self.target.content_object))
        if self.subject:
            model_str += ' by {}'.format(self.subject.content_object)
        return model_str

    @property
    def action_type(self):
        sep_pos = self.action.find('/')
        if sep_pos >= 0:
            return self.action[0:sep_pos]
        return self.action
