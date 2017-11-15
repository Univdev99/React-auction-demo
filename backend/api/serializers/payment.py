from django.core.exceptions import ObjectDoesNotExist

from rest_framework import serializers
from pinax.stripe.actions import charges

from payment.mixins import StripeCustomerMixin


class SetPaymentSerializer(StripeCustomerMixin, serializers.Serializer):
    token = serializers.CharField()

    def save(self):
        user = self.context.get('user')
        token = self.validated_data['token']
        try:
            user.customer
            self.update_customer(user, token)
        except ObjectDoesNotExist:
            self.create_customer(user, token)


class PaymentSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=None, decimal_places=3)

    def save(self):
        user = self.context.get('user')
        amount = self.validated_data['amount']
        charges.create(
            amount=amount,
            customer=user.customer.stripe_id,
        )
