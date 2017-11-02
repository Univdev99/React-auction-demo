from django.contrib import admin
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.utils import html

from payment.models import Transaction
from payment.models import TransactionParticipant


class TransactionAdmin(admin.ModelAdmin):
    model = Transaction

    list_display = (
        'get_transaction',
        'amount',
        'get_sender',
        'get_receiver',
        'paid_at',
    )

    def get_queryset(self, request):
        return super(TransactionAdmin, self).get_queryset(request) \
            .select_related('sender') \
            .select_related('receiver')

    def get_transaction_participant_change_link(self, participant):
        return reverse(
            'admin:{}_{}_change'.format(participant.content_type.app_label, participant.content_type.model),
            args=[participant.object_id]
        )

    def get_transaction(self, obj):
        return 'Transaction ID {}'.format(obj.id)
    get_transaction.short_description = "Transaction"

    def get_sender(self, obj):
        if obj.sender.content_object:
            return mark_safe('<a href="{}">{}</a>'.format(
                self.get_transaction_participant_change_link(obj.sender),
                html.escape(str(obj.sender.content_object)),
            ))
        else:
            return 'Site Owner'
    get_sender.short_description = "Sender"

    def get_receiver(self, obj):
        if obj.receiver.content_object:
            return mark_safe('<a href="{}">{}</a>'.format(
                self.get_transaction_participant_change_link(obj.receiver),
                html.escape(str(obj.receiver.content_object)),
            ))
        else:
            return 'Site Owner'
    get_receiver.short_description = "Receiver"

admin.site.register(Transaction, TransactionAdmin)
