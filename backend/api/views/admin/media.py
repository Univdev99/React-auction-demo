from django.contrib.auth import get_user_model

from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.filters.date import CreatedDateFilterByMonthBackend
from api.filters.storage import MediumTypeFilterBackend
from api.serializers.storage import MediumSerializer
from api.paginations import TwelvePerPagePagination
from api.permissions import IsAdmin
from storage.models import Medium


class MediumListView(generics.ListAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    pagination_class = TwelvePerPagePagination
    queryset = Medium.objects.order_by('-created_at')
    serializer_class = MediumSerializer
    filter_backends = (MediumTypeFilterBackend, CreatedDateFilterByMonthBackend)
