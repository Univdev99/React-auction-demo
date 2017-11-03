from django.conf import settings

from rest_framework import views
from rest_framework.response import Response

from notification.channels.auctions import AuctionChannel


class TestView(views.APIView):
    def get(self, *args, **kwargs):
        AuctionChannel.send('test message send')

        return Response({
            'success': True,
        })
