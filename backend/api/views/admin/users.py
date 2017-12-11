from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q

from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.paginations import TenPerPagePagination
from api.permissions import IsAdmin
from api.serializers.auth import UserSerializer
from api.serializers.auth import UserBlockUnblockSerializer
from api.serializers.history import HistoryRecordSerializer
from history.models import HistoryRecord
from history.models import HistoryRecordEntity


class UserListView(generics.ListAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    queryset = get_user_model().objects.order_by('-is_staff', 'date_joined')
    serializer_class = UserSerializer
    pagination_class = TenPerPagePagination


class UserBlockUnblockView(generics.UpdateAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = UserBlockUnblockSerializer
    lookup_url_kwarg = 'pk'
    queryset = get_user_model().objects.all()

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        user.is_active = not serializer.validated_data['block']
        user.save()

        serializer = UserSerializer(user)
        return Response(serializer.data)


class UserHistoryView(generics.ListAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = HistoryRecordSerializer
    pagination_class = TenPerPagePagination

    def get_queryset(self):
        user = get_user_model().objects.get(pk=self.kwargs.get('pk'))
        user_content_type = ContentType.objects.get_for_model(get_user_model())
        return HistoryRecord.objects.filter(
            (Q(subject__object_id=user.pk) & Q(subject__content_type=user_content_type)) |
            (Q(target__object_id=user.pk) & Q(target__content_type=user_content_type))
        )
