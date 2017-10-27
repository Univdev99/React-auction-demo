import random

from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework import generics
from rest_framework import views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.serializers.auctions import AuctionSerializer
from api.serializers.auctions import AuctionDetailSerializer
from api.serializers.storage import UploadMediumSerializer
from api.permissions import IsAdmin
from auction.models import Auction


class AuctionListView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = AuctionSerializer

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return AuctionSerializer
        else:
            return AuctionDetailSerializer


class AuctionDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = AuctionDetailSerializer
    lookup_url_kwarg = 'pk'
    queryset = Auction.objects.all()
