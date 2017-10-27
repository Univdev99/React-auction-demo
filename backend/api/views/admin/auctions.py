import random

from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import generics
from rest_framework import views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.serializers.auctions import AuctionSerializer
from api.serializers.storage import UploadMediumSerializer
from api.permissions import IsAdmin
from auction.constants import AUCTION_STATUS_PREVIEW
from auction.models import Auction


class AuctionListView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    queryset = Auction.objects.order_by('pk')
    serializer_class = AuctionSerializer


class AuctionDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = AuctionSerializer
    lookup_url_kwarg = 'pk'
    queryset = Auction.objects.all()

    def destroy(self, *args, **kwargs):
        auction = self.get_object()
        if auction.status != AUCTION_STATUS_PREVIEW:
            raise ParseError('Only auctions in preview status can be deleted')
        return super(AuctionDetailView, self).destroy(*args, **kwargs)


class AuctionStartView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = AuctionSerializer
    lookup_url_kwarg = 'pk'
    queryset = Auction.objects.all()

    def post(self, *args, **kwargs):
        auction = self.get_object()
        auction.start()

        serializer = self.get_serializer(auction)
        return Response(serializer.data)


class AuctionFinishView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = AuctionSerializer
    lookup_url_kwarg = 'pk'
    queryset = Auction.objects.all()

    def post(self, *args, **kwargs):
        auction = self.get_object()
        auction.finish()

        serializer = self.get_serializer(auction)
        return Response(serializer.data)


class AuctionCancelView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = AuctionSerializer
    lookup_url_kwarg = 'pk'
    queryset = Auction.objects.all()

    def post(self, *args, **kwargs):
        auction = self.get_object()
        auction.cancel()

        serializer = self.get_serializer(auction)
        return Response(serializer.data)
