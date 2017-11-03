from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


class TransactionParticipant(models.Model):
    content_type = models.ForeignKey(ContentType, null=True, blank=True, on_delete=models.SET_NULL)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey()

    class Meta:
        verbose_name_plural = 'TransactionParticipants'

    def __str__(self):
        if self.content_object:
            return 'Transaction Participant <{} ID {}>'.format(
                self.content_type.model,
                self.object_id
            )
        else:
            return 'Company'

    @classmethod
    def get_site_owner_object(cls):
        try:
            site_owner_object = cls.objects.get(object_id=None)
        except cls.DoesNotExist:
            site_owner_object = TransactionParticipant(
                content_type=None,
                object_id=None
            )
            site_owner_object.save()
        return site_owner_object

    @property
    def is_site_owner(self):
        return not self.content_object


class Transaction(models.Model):
    amount = models.FloatField()
    paid_at = models.DateTimeField()

    sender = models.ForeignKey(TransactionParticipant, related_name='sender', on_delete=models.CASCADE)
    receiver = models.ForeignKey(TransactionParticipant, related_name='receiver', on_delete=models.CASCADE)

    def __str__(self):
        return 'Transaction from {} to {}'.format(
            str(self.sender),
            str(self.receiver)
        )
