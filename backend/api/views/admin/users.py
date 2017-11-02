from django.contrib.auth import get_user_model

from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.serializers.auth import UserSerializer
from api.serializers.auth import UserBlockUnblockSerializer
from api.permissions import IsAdmin


class UserListView(generics.ListAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    queryset = get_user_model().objects.select_related('profile').order_by('-is_staff', 'date_joined')
    serializer_class = UserSerializer


class UserBlockUnblockView(generics.UpdateAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    serializer_class = UserBlockUnblockSerializer
    lookup_url_kwarg = 'pk'
    queryset = get_user_model().objects.all().select_related('profile')

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        user.is_active = not serializer.validated_data['block']
        user.save()

        serializer = UserSerializer(user)
        return Response(serializer.data)
