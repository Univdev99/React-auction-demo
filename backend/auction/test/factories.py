from decimal import Decimal

from django.utils import timezone

import factory
from pinax.stripe.models import Customer

from account.test.factories import UserFactory
from auction.constants import AUCTION_STATUS_PREVIEW
from auction.constants import BID_STATUS_ACTIVE
from auction.models import Auction
from auction.models import Bid
from entity.test.factories import ProductFactory


class AuctionFactory(factory.DjangoModelFactory):
    class Meta:
        model = Auction

    title = factory.Sequence(
        lambda n: 'Auction {}'.format(n)
    )
    starting_price = 10000
    status = AUCTION_STATUS_PREVIEW

    product = factory.SubFactory(ProductFactory)


class BidFactory(factory.DjangoModelFactory):
    class Meta:
        model = Bid

    price = factory.Sequence(lambda n: 11000 + n * 100)
    status = BID_STATUS_ACTIVE
    placed_at = timezone.now()
    closed_at = None

    user = factory.SubFactory(UserFactory)
    auction = factory.SubFactory(AuctionFactory)


class CustomerFactory(factory.DjangoModelFactory):
    class Meta:
        model = Customer

    stripe_id = factory.Sequence(
        lambda n: 'cu_{}'.format(1000000 + n)
    )
    created_at = timezone.now()
    user = factory.SubFactory(UserFactory)
    account_balance = Decimal(20000.0)
