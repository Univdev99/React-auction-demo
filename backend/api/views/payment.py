from rest_framework import views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.serializers.payment import SetPaymentSerializer
from api.serializers.payment import PaymentSerializer


class AccountPaymentView(views.APIView):
    permission_classes = (IsAuthenticated, )

    def get_serializer_context(self):
        return {
            'user': self.request.user,
        }

    def post(self, request, *args, **kwargs):
        serializer = SetPaymentSerializer(
            data=request.data,
            context=self.get_serializer_context(),
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'success': True})


class PaymentTestView(views.APIView):
    permission_classes = (IsAuthenticated, )

    def get_serializer_context(self):
        return {
            'user': self.request.user,
        }

    def post(self, request, *args, **kwargs):
        serializer = PaymentSerializer(
            data=request.data,
            context=self.get_serializer_context(),
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'success': True})
