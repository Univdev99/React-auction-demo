from django.core.exceptions import ObjectDoesNotExist

from pinax.stripe.actions import customers


class StripeCustomerMixin(object):
    def create_customer_if_not_exists(self, user, token):
        try:
            return user.customer
        except ObjectDoesNotExist:
            return customers.create(
                user,
                card=token,
                plan=None,
                charge_immediately=False
            )
