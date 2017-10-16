from django.conf.urls import url
from rest_framework_jwt.views import obtain_jwt_token

from api.views.auth import SignUpView
from api.views.auth import SignUpVerificationView
from api.views.auth import SignUpWithFacebookView
from api.views.auth import CurrentUserView


urlpatterns = [
    url(r'^signin/$', obtain_jwt_token, name='signin'),
    url(r'^signup/$', SignUpView.as_view(), name='signup'),
    url(r'^verify-signup/$', SignUpVerificationView.as_view(), name='verify-signup'),
    url(r'^signup-with-facebook/$', SignUpWithFacebookView.as_view(), name='signup-with-facebook'),
    url(r'^current-user/$', CurrentUserView.as_view(), name='current-user'),
]
