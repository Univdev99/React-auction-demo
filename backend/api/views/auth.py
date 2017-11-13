from django.contrib.auth import get_user_model
from django.conf import settings
from django.core import mail
from django.db import transaction
from django.utils.crypto import get_random_string

from facebook import GraphAPI, GraphAPIError
from rest_framework import generics, views
from rest_framework.exceptions import ParseError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from api.serializers.auth import SignUpSerializer
from api.serializers.auth import SignUpVerificationSerializer
from api.serializers.auth import SignUpWithFacebookSerializer
from api.serializers.auth import UserSerializer
from api.serializers.auth import UpdatePasswordSerializer

from account.models import UserVerification


class SignUpView(views.APIView):
    authentication_classes = ()
    permission_classes = ()

    @transaction.atomic
    def post(self, *args, **kwargs):
        serializer = SignUpSerializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        user = get_user_model().objects.create_user(
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
    permission_classes = (IsAuthenticated, )

    def get(self, *args, **kwargs):
        serializer = UserSerializer(self.request.user)
        return Response(serializer.data)

    def put(self, *args, **kwargs):
        serializer = UserSerializer(instance=self.request.user, data=self.request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class UpdatePasswordView(generics.UpdateAPIView):
    """
    An endpoint for updating password.
    """
    serializer_class = UpdatePasswordSerializer
    model = get_user_model()
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get('old_password')):
                return Response({'old_password': ['Wrong password.']}, status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get('new_password'))
            self.object.save()
            return Response('ok', status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
