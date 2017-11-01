import json

from common.test import TestCase
from django.urls import reverse

from rest_framework import status

from auction.test.factories import AuctionFactory


class AuctionPlaceBidViewTests(TestCase):
    def setUp(self):
        super(AuctionPlaceBidViewTests, self).setUp()
        self.auction = AuctionFactory.create()
        self.product = self.auction.product

    def test_authenticated_users_place_bid(self):
        response = self.client.post(reverse('api:auction-place-bid'), {
            'price': 11000,
            'auction': self.auction.pk
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unauthenticated_users_cannot_place_bid(self):
        self.client.logout()
        response = self.client.post(
            reverse('api:auction-place-bid', kwargs=dict(pk=self.auction.pk)),
            {
                'price': 11000,
                'auction': self.auction.pk
            }
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
