from rest_framework import serializers

from pinax.stripe.actions import charges


class PayloadSerializer(serializers.Serializer):
    payload = serializers.JSONField()


class PaymentSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=None, decimal_places=3)

    def save(self):
        user = self.context.get('user')
        amount = self.validated_data['amount']
        charges.create(
            amount=amount,
            customer=user.customer.stripe_id,
        )
