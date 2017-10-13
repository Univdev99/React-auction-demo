from django.conf.urls import url
from rest_framework_jwt.views import obtain_jwt_token

from api.views.auth import SignUpView
from api.views.auth import CurrentUserView


urlpatterns = [
    url('signin/', obtain_jwt_token),
    url('signup/', SignUpView.as_view()),
    url('current-user/', CurrentUserView.as_view()),
]
