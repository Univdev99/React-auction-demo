from rest_framework import serializers


class PasswordVerificationMixin(object):
    def validate(self, data):
        data = super(PasswordVerificationMixin, self).validate(data)
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError('Password confirmation does not match')
        return data


class SignUpSerializer(PasswordVerificationMixin, serializers.Serializer):
    username = serializers.CharField(required=True)
    email = serializers.CharField(required=True)
    password = serializers.CharField(min_length=6, required=True)
    password_confirm = serializers.CharField(min_length=6, required=True)


class SignUpWithFacebookSerializer(PasswordVerificationMixin, serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(min_length=6, required=True)
    password_confirm = serializers.CharField(min_length=6, required=True)
    access_token = serializers.CharField(required=True)


class SignUpVerificationSerializer(serializers.Serializer):
    token = serializers.CharField(required=True, min_length=32, max_length=32)


class CurrentUserSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    email = serializers.CharField(required=True)
    is_staff = serializers.BooleanField()
