from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from rest_framework import serializers
from pinax.stripe.actions import charges
from pinax.stripe.actions import customers
from pinax.stripe.actions import invoices
from pinax.stripe.models import Customer
from common.exceptions import PaymentRequired


class StripeCustomerMixin(object):
    def create_customer(self, user, token):
        return customers.create(
            user,
            card=token,
            plan=None,
            charge_immediately=False
        )

    def update_customer(self, user, token):
        stripe_customer = user.customer.stripe_customer
        stripe_customer.source = token
        stripe_customer.save()


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
        return user.customer


class PaymentSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=None, decimal_places=3)

    def save(self):
        user = self.context.get('user')
        amount = self.validated_data['amount']
        try:
            charges.create(
                amount=amount,
                customer=user.customer.stripe_id,
            )
        except:
            raise PaymentRequired


class PaymentInfoSerializer(serializers.ModelSerializer):
    last4 = serializers.SerializerMethodField()
    brand = serializers.SerializerMethodField()

    class Meta:
        model = Customer
        fields = ('last4', 'brand',)

    def get_card(self, obj):
        try:
            card = obj.card_set.get(stripe_id=obj.default_source)
        except ObjectDoesNotExist:
            card = obj.card_set.order_by('-id')[0]
        return card

    def get_brand(self, obj):
        return self.get_card(obj).brand

    def get_last4(self, obj):
        return self.get_card(obj).last4
