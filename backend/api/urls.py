from django.conf.urls import url
from rest_framework_jwt.views import obtain_jwt_token

from api.views.auth import SignUpView


urlpatterns = [
    url('signin/', obtain_jwt_token),
    url('signup/', SignUpView.as_view()),
]
