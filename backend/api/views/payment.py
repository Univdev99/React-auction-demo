from rest_framework import views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.serializers.payment import PaymentInfoSerializer
from api.serializers.payment import PaymentSerializer
from api.serializers.payment import SetPaymentSerializer
from history.constants import HISTORY_RECORD_USER_UPDATE_PAYMENT
from history.models import HistoryRecord


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
        customer = serializer.save()

        HistoryRecord.objects.create_history_record(self.request.user, None, HISTORY_RECORD_USER_UPDATE_PAYMENT)

        response_ser = PaymentInfoSerializer(instance=customer)
        return Response(response_ser.data)


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
