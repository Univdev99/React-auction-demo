import random
from datetime import timedelta

from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from api.serializers.notifications import NotificationSerializer
from api.paginations import TenPerPagePagination
from api.permissions import IsAdmin
from notification.models import Notification


class NotificationListForMenuView(generics.ListAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    queryset = Notification.objects.order_by('-created_at')[:5]
    serializer_class = NotificationSerializer


class NotificationListView(generics.ListAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    queryset = Notification.objects.order_by('-created_at')
    serializer_class = NotificationSerializer
    pagination_class = TenPerPagePagination
