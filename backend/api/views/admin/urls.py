from django.conf.urls import url
from rest_framework_jwt.views import obtain_jwt_token

from api.views.admin.donor import DonorListView
from api.views.admin.donor import DonorDetailView
from api.views.admin.donor import DonorLogoUploadView
from api.views.admin.donor import DonorVideoUploadView
from api.views.admin.charity import CharityListView
from api.views.admin.charity import CharityDetailView
from api.views.admin.charity import CharityLogoUploadView


urlpatterns = [
    # donor api endpoints
    url(r'^donors/$', DonorListView.as_view(), name='donor-list'),
    url(r'^donors/(?P<pk>[0-9]+)/$', DonorDetailView.as_view(), name='donor-detail'),
    url(r'^donors/(?P<pk>[0-9]+)/logo/$', DonorLogoUploadView.as_view(), name='donor-logo'),
    url(r'^donors/(?P<pk>[0-9]+)/video/$', DonorVideoUploadView.as_view(), name='donor-video'),

    # charity api endpoints
    url(r'^charities/$', CharityListView.as_view(), name='charity-list'),
    url(r'^charities/(?P<pk>[0-9]+)/$', CharityDetailView.as_view(), name='charity-detail'),
    url(r'^charities/(?P<pk>[0-9]+)/logo/$', CharityLogoUploadView.as_view(), name='charity-logo'),
]
