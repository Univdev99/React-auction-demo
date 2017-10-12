from rest_framework import serializers


class SignUpSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    email = serializers.CharField(required=True)
    password = serializers.CharField(min_length=6, required=True)
    password_confirm = serializers.CharField(min_length=6, required=True)

    def validate(self, data):
        data = super(SignUpSerializer, self).validate(data)
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError('Password confirmation does not match')
        return data
