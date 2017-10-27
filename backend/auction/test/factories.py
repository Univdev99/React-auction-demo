import factory

from auction.constants import AUCTION_STATUS_PREVIEW
from auction.models import Auction
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
