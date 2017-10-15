from django.contrib.auth import get_user_model
from django.utils.crypto import get_random_string

from rest_framework import views
from rest_framework.exceptions import ParseError
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from api.serializers.auth import SignUpSerializer
from api.serializers.auth import SignUpVerificationSerializer
from api.serializers.auth import CurrentUserSerializer

from account.models import UserVerification


class SignUpView(views.APIView):
    authentication_classes = ()
    permission_classes = ()

    def post(self, *args, **kwargs):
        serializer = SignUpSerializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        user = get_user_model().objects.create_user(
            serializer.data['username'],
            serializer.data['email'],
            serializer.data['password'],
            is_active=False,
        )
        user_verification = UserVerification.objects.create(
            token=get_random_string(32),
            user=user
        )
        return Response({
            'token': user_verification.token,
        }, status=201)


class SignUpVerificationView(views.APIView):
    authentication_classes = ()
    permission_classes = ()

    def get(self, *args, **kwargs):
        return Response({'test': True})

    def post(self, *args, **kwargs):
        serializer = SignUpVerificationSerializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        token = serializer.validated_data['token']
        try:
            verification = UserVerification.objects.select_related('user').get(token=token)
        except UserVerification.DoesNotExist:
            raise ParseError(detail='Verification token not found')
        verification.user.is_active = True
        verification.user.save()
        return Response({
            'success': True
        })


class CurrentUserView(views.APIView):
    def get(self, *args, **kwargs):
        serializer = CurrentUserSerializer(self.request.user)
        return Response(serializer.data)
