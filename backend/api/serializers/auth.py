from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework import serializers

from .payment import PaymentInfoSerializer


class PasswordVerificationMixin(object):
    def validate_password(self, value):
        return make_password(value if value else get_user_model().objects.make_random_password())


class SignUpSerializer(PasswordVerificationMixin, serializers.ModelSerializer):
    password = serializers.CharField(min_length=6, write_only=True)
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)

    class Meta:
        model = get_user_model()
        fields = ('email', 'first_name', 'last_name', 'password',)


class SignUpVerificationSerializer(serializers.Serializer):
    token = serializers.CharField(min_length=32, max_length=32)


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=False)
    payment_info = PaymentInfoSerializer(source='customer', required=False)
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = get_user_model()
        fields = (
            'pk', 'username', 'first_name', 'last_name', 'email', 'is_staff', 'is_active', 'date_joined', 'last_login',
            'phone_number', 'address_line', 'city', 'zipcode', 'country', 'payment_info', 'avatar'
        )
        read_only_fields = ('pk', 'date_joined', 'last_login', 'payment_info', 'avatar')

    def get_avatar(self, obj):
        return obj.avatar.url if obj.avatar else None


class UserBlockUnblockSerializer(serializers.Serializer):
    block = serializers.BooleanField()


class UpdatePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
