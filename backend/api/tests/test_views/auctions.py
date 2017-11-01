from datetime import timedelta

from django.urls import reverse
from django.utils import timezone

from rest_framework import status

from common.test import APITestCase
from auction.constants import AUCTION_STATUS_OPEN
from auction.test.factories import AuctionFactory


class AuctionPlaceBidViewTests(APITestCase):
    def setUp(self):
        super(AuctionPlaceBidViewTests, self).setUp()
        self.auction = AuctionFactory.create(
            status=AUCTION_STATUS_OPEN,
            open_until=timezone.now() + timedelta(days=3)
        )
        self.product = self.auction.product

    def test_authenticated_users_place_bid(self):
        response = self.client.post(
            reverse('api:auction-place-bid', kwargs=dict(pk=self.auction.pk)),
            {
                'price': 11000,
                'auction': self.auction.pk
            }
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.content)

    def test_unauthenticated_users_cannot_place_bid(self):
        self.client.logout()
        response = self.client.post(
            reverse('api:auction-place-bid', kwargs=dict(pk=self.auction.pk)),
            {
                'price': 11000,
                'auction': self.auction.pk
            }
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
