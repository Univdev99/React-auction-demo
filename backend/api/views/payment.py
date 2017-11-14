from rest_framework import views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.serializers.payment import PayloadSerializer
from api.serializers.payment import PaymentSerializer
from payment.mixins import StripeCustomerMixin


class AccountPaymentView(StripeCustomerMixin, views.APIView):
    permission_classes = (IsAuthenticated, )
    
    def post(self, request, *args, **kwargs):
        serializer = PayloadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        payload = serializer.validated_data['payload']
        self.create_customer_if_not_exists(request.user, payload['token']['id'])

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
