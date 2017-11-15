from pinax.stripe.actions import customers


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
