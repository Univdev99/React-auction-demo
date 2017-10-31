from django.conf.urls import url, include
from rest_framework_jwt.views import obtain_jwt_token

from api.views.auth import SignUpView
from api.views.auth import SignUpVerificationView
from api.views.auth import SignUpWithFacebookView
from api.views.auth import CurrentUserView
from api.views.donors import DonorFrontListView
from api.views.donors import DonorListView
from api.views.donors import DonorDetailView
from api.views.jobs import JobListView
from api.views.jobs import JobDetailView
# temporary endpoint for testing
from api.views.test import TestView


urlpatterns = [
    url(r'^signin/$', obtain_jwt_token, name='signin'),
    url(r'^signup/$', SignUpView.as_view(), name='signup'),
    url(r'^verify-signup/$', SignUpVerificationView.as_view(), name='verify-signup'),
    url(r'^signup-with-facebook/$', SignUpWithFacebookView.as_view(), name='signup-with-facebook'),
    url(r'^current-user/$', CurrentUserView.as_view(), name='current-user'),
    url(r'^test/$', TestView.as_view()),

    url(r'^donors/front/$', DonorFrontListView.as_view(), name='donor-front-list'),
    url(r'^donors/$', DonorListView.as_view(), name='donor-list'),
    url(r'^donors/(?P<pk>[0-9]+)/$', DonorDetailView.as_view(), name='donor-detail'),

    url(r'^jobs/$', JobListView.as_view(), name='job-list'),
    url(r'^jobs/(?P<pk>[0-9]+)/$', JobDetailView.as_view(), name='job-detail'),

    url(r'^admin/', include('api.views.admin.urls', namespace='admin')),
]
