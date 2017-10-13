from django.contrib.auth import get_user_model

from rest_framework import views
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from api.serializers.auth import SignUpSerializer
from api.serializers.auth import CurrentUserSerializer


class SignUpView(views.APIView):
    authentication_classes = ()
    permission_classes = ()

    def post(self, *args, **kwargs):
        serializer = SignUpSerializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        user = get_user_model().objects.create_user(
            serializer.data['username'],
            serializer.data['email'],
            serializer.data['password']
        )
        return Response({
            'success': True
        })


class CurrentUserView(views.APIView):
    def get(self, *args, **kwargs):
        serializer = CurrentUserSerializer(self.request.user)
        return Response(serializer.data)
