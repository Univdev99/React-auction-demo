from django.conf import settings
from django.db import models
from django.db.models import Max

from auction.constants import AUCTION_STATUS_CHOICES
from auction.constants import AUCTION_STATUS_OPEN
from auction.constants import BID_STATUS_CHOICES
from auction.constants import BID_STATUS_ACTIVE
from entity.models import Product


class Auction(models.Model):
    title = models.CharField(max_length=300)
    starting_price = models.FloatField()
    status = models.CharField(
        choices=AUCTION_STATUS_CHOICES,
        default=AUCTION_STATUS_OPEN,
        max_length=50,
    )
    started_at = models.DateTimeField(null=True, blank=True, default=None)
    ended_at = models.DateTimeField(null=True, blank=True, default=None)

    product = models.ForeignKey(Product)

    def __str__(self):
        return 'Auction on {}'.format(self.product.title)

    @property
    def current_price(self):
        result = Bid.objects.aggregate(max_price=Max('price'))
        return result['max_price'] if result['max_price'] else self.starting_price


class Bid(models.Model):
    price = models.FloatField()
    status = models.CharField(
        choices=BID_STATUS_CHOICES,
        default=BID_STATUS_ACTIVE,
        max_length=50,
    )
    placed_at = models.DateTimeField()
    closed_at = models.DateTimeField(null=True, blank=True, default=None)

    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    auction = models.ForeignKey(Auction)

    def __str__(self):
        return 'Bid by {} on {}'.format(self.user.username, str(self.auction))
