import random

from django.contrib.auth import get_user_model
from django.conf import settings
from django.core import mail
from django.db import transaction
from django.utils.crypto import get_random_string
from facebook import GraphAPI, GraphAPIError
from rest_framework_jwt.serializers import JSONWebTokenSerializer

from rest_framework import generics, views
from rest_framework.exceptions import ParseError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from api.serializers.auth import SignUpSerializer
from api.serializers.auth import SignUpVerificationSerializer
from api.serializers.auth import UserSerializer
from api.serializers.auth import UpdatePasswordSerializer
from api.serializers.entities import CharitySerializer
from api.serializers.storage import UploadMediumSerializer

from account.models import UserVerification
from history.constants import HISTORY_RECORD_USER_SIGNUP
from history.constants import HISTORY_RECORD_USER_SIGNUP_VERIFY
from history.constants import HISTORY_RECORD_USER_SIGNUP_FACEBOOK
from history.constants import HISTORY_RECORD_USER_UPDATE_DETAILS
from history.models import HistoryRecord

from storage.mixins import MediumUploadMixin
from storage.mixins import MediumDeleteMixin


class SignUpView(views.APIView):
    authentication_classes = ()
    permission_classes = ()

    @transaction.atomic
    def post(self, *args, **kwargs):
        serializer = SignUpSerializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        user_verification = UserVerification.objects.create(
            token=get_random_string(32),
            user=user
        )

        HistoryRecord.objects.create_history_record(user, None, HISTORY_RECORD_USER_SIGNUP)

        with mail.get_connection() as connection:
            mail.EmailMessage(
                'Account Verification',
                'Please verify your registered account by clicking on this URL: {}'.format(
                    settings.SITE_URL + '/verify-account/{}'.format(user_verification.token)
                ),
                settings.NO_REPLY_EMAIL_ADDRESS,
                [serializer.validated_data['email']],
                connection=connection,
            ).send()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


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

        HistoryRecord.objects.create_history_record(verification.user, None, HISTORY_RECORD_USER_SIGNUP_VERIFY)

        return Response({
            'success': True
        })


class SignUpWithFacebookView(views.APIView):
    authentication_classes = ()
    permission_classes = ()

    def post(self, *args, **kwargs):
        try:
            graph = GraphAPI(
                access_token=self.request.data['access_token'],
                version=settings.FACEBOOK_APP_VERSION
            )
            graph_data = graph.get_object(id='me', fields='email,first_name,last_name')
        except GraphAPIError:
            raise ParseError(detail='Invalid Facebook access token')

        data = {
            **graph_data,
            'password': get_user_model().objects.make_random_password()
        }

        user, created = get_user_model().objects.get_or_create(email=data['email'])
        signup_ser = SignUpSerializer(instance=user, data=data)
        signup_ser.is_valid(raise_exception=True)

        user = signup_ser.save(is_active=True)

        token_ser = JSONWebTokenSerializer(data={'email': data['email'], 'password': data['password']})
        token_ser.is_valid(raise_exception=True)

        HistoryRecord.objects.create_history_record(user, None, HISTORY_RECORD_USER_SIGNUP_FACEBOOK)

        return Response({
            'token': token_ser.object.get('token')
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class CurrentUserView(views.APIView):
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        return super(CurrentUserView, self).get_queryset().select_related('customer').prefetch_related('customer__card_set')

    def get(self, *args, **kwargs):
        serializer = UserSerializer(self.request.user)
        return Response(serializer.data)

    def put(self, *args, **kwargs):
        serializer = UserSerializer(instance=self.request.user, data=self.request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        HistoryRecord.objects.create_history_record(self.request.user, None, HISTORY_RECORD_USER_UPDATE_DETAILS)

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


class CurrentUserAvatarUploadView(MediumUploadMixin, generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer
    tmp_file_prefix = 'user_avatar'

    def get_queryset(self):
        return get_user_model().objects.all().select_related('avatar')

    def put(self, *args, **kwargs):
        user = self.request.user

        serializer = UploadMediumSerializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)

        self.is_mimetype_image(serializer.validated_data['file'])
        avatar_medium = self.upload_medium(
            serializer.validated_data['file'],
            'user/avatar',
            '{}_{}'.format(user.pk, random.randint(10000000, 99999999)),
            content_object=user
        )

        try:
            if user.avatar:
                self.delete_medium(user.avatar)
        except:
            pass

        user.avatar = avatar_medium
        user.save()

        serializer = self.get_serializer(user)
        return Response(serializer.data)
