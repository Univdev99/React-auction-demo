from django.contrib.auth import get_user_model
from django.conf import settings
from django.core import mail
from django.db import transaction
from django.utils.crypto import get_random_string

from facebook import GraphAPI, GraphAPIError
from rest_framework import views
from rest_framework.exceptions import ParseError
from rest_framework.response import Response
from rest_framework import status
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from api.serializers.auth import SignUpSerializer
from api.serializers.auth import SignUpVerificationSerializer
from api.serializers.auth import SignUpWithFacebookSerializer
from api.serializers.auth import CurrentUserSerializer

from account.models import UserVerification


class SignUpView(views.APIView):
    authentication_classes = ()
    permission_classes = ()

    @transaction.atomic
    def post(self, *args, **kwargs):
        serializer = SignUpSerializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        user = get_user_model().objects.create_user(
            serializer.validated_data['username'],
            serializer.validated_data['email'],
            serializer.validated_data['password'],
            is_active=False,
        )
        user_verification = UserVerification.objects.create(
            token=get_random_string(32),
            user=user
        )
        with mail.get_connection() as connection:
            mail.EmailMessage(
                'Account Verification',
                'Please verify your registered account by clicking on this URL: {}'.format(
                    'http://localhost:3000/verify-account/{}'.format(user_verification.token)
                ),
                settings.NO_REPLY_EMAIL_ADDRESS,
                [serializer.validated_data['email']],
                connection=connection,
            ).send()
        return Response({
            'token': user_verification.token,
        }, status=status.HTTP_201_CREATED)


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
            raise ParseError(detail='Invalid account verification token')
        if not verification.is_pending:
            raise ParseError(detail='Invalid account verification token')

        verification.is_pending = False
        verification.save()
        verification.user.is_active = True
        verification.user.save()
        return Response({
            'success': True
        })


class SignUpWithFacebookView(views.APIView):
    authentication_classes = ()
    permission_classes = ()

    def post(self, *args, **kwargs):
        serializer = SignUpWithFacebookSerializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)

        access_token = serializer.validated_data['access_token']
        try:
            graph = GraphAPI(access_token=access_token, version=settings.FACEBOOK_APP_VERSION)
            data = graph.get_object(id='me', fields='email,first_name,last_name')
        except GraphAPIError:
            raise ParseError(detail='Invalid Facebook access token')

        user = get_user_model().objects.create_user(
            serializer.validated_data['username'],
            data['email'],
            serializer.validated_data['password'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            is_active=True,
        )
        return Response({
            'success': True
        }, status=status.HTTP_201_CREATED)


class CurrentUserView(views.APIView):
    def get(self, *args, **kwargs):
        serializer = CurrentUserSerializer(self.request.user)
        return Response(serializer.data)

    def put(self, *args, **kwargs):
        serializer = CurrentUserSerializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)

        user = self.request.user
        user.username = serializer.validated_data['username']
        user.first_name = serializer.validated_data['first_name']
        user.last_name = serializer.validated_data['last_name']
        if 'password' in serializer.validated_data:
            user.set_password(serializer.validated_data['password'])
        user.save()

        serializer = CurrentUserSerializer(self.request.user)
        return Response(serializer.data)
