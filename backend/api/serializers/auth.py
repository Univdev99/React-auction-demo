from django.contrib.auth import get_user_model

from rest_framework import serializers
from account.models import Profile


class PasswordVerificationMixin(object):
    def validate(self, data):
        data = super(PasswordVerificationMixin, self).validate(data)
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError('Password confirmation does not match')
        return data


class OptionalPasswordVerificationMixin(object):
    def validate(self, data):
        data = super(OptionalPasswordVerificationMixin, self).validate(data)
        if 'password' in data and 'password_confirm' in data and data['password'] != data['password_confirm']:
            raise serializers.ValidationError('Password confirmation does not match')
        return data


class SignUpSerializer(PasswordVerificationMixin, serializers.Serializer):
    username = serializers.CharField()
    email = serializers.CharField()
    password = serializers.CharField(min_length=6, write_only=True)
    password_confirm = serializers.CharField(min_length=6, write_only=True)


class SignUpWithFacebookSerializer(PasswordVerificationMixin, serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(min_length=6, write_only=True)
    password_confirm = serializers.CharField(min_length=6, write_only=True)
    access_token = serializers.CharField()


class SignUpVerificationSerializer(serializers.Serializer):
    token = serializers.CharField(min_length=32, max_length=32)


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = (
            'pk', 'phone_number', 'address_line', 'city', 'zipcode', 'country'
        )
        read_only_fields = ('pk',)


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False)

    class Meta:
        model = get_user_model()
        fields = (
            'pk', 'username', 'first_name', 'last_name', 'email', 'is_staff', 'is_active', 'date_joined', 'last_login', 'profile'
        )
        read_only_fields = ('pk', 'date_joined', 'last_login')

    def update(self, instance, validated_data):
        if 'profile' in validated_data:
            profile_data = validated_data.pop('profile')
            profile_ser = ProfileSerializer(instance=instance.profile, data=profile_data)
            profile_ser.is_valid()
            profile_ser.save()
        return super(UserSerializer, self).update(instance, validated_data)


class UserBlockUnblockSerializer(serializers.Serializer):
    block = serializers.BooleanField()


class UpdatePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
