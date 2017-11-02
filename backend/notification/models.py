from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.contrib.postgres.fields import JSONField
from django.core.serializers.json import DjangoJSONEncoder
from django.dispatch import receiver
from django.db.models.signals import post_save

from notification.constants import NOTIFICATION_TYPE_AUCTION
from notification.constants import NOTIFICATION_CONTENT_CHOICES
from notification.channels.auctions import AuctionChannel


class NotificationEntity(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey()

    class Meta:
        verbose_name_plural = 'NotificationEntities'


class Notification(models.Model):
    subject = models.ForeignKey(
        NotificationEntity,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='subject'
    )
    object = models.ForeignKey(NotificationEntity, on_delete=models.CASCADE, related_name='object')
    action = models.CharField(
        max_length=50,
        choices=NOTIFICATION_CONTENT_CHOICES,
    )
    extra = JSONField(encoder=DjangoJSONEncoder, null=True, blank=True, default=None)

    def __str__(self):
        str = 'Notification <{}> on {}'.format(self.action, str(self.object.content_object))
        if str.subject:
            str += ' by {}'.format(self.subject.content_object)
        return str

    @classmethod
    def create_notification(cls, subject, object, action, extra=None):
        if subject:
            subject_notification_entity = NotificationEntity()
            subject_notification_entity.content_object = subject
            subject_notification_entity.save()
        else:
            subject_notification_entity = None

        object_notification_entity = NotificationEntity()
        object_notification_entity.content_object = object
        object_notification_entity.save()

        return cls.objects.create(
            subject=subject_notification_entity,
            object=object_notification_entity,
            action=action,
            extra=extra
        )

    @property
    def action_type(self):
        sep_pos = self.action.find('/')
        if sep_pos >= 0:
            return self.action[0:sep_pos]
        return self.action


@receiver(post_save, sender=Notification)
def handle_create_notification(sender, instance, created, *args, **kwargs):
    if instance.action_type == NOTIFICATION_TYPE_AUCTION:
        AuctionChannel.send('test message')
