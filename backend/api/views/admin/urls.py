from django.conf.urls import url
from rest_framework_jwt.views import obtain_jwt_token

from api.views.admin.charities import CharityListView
from api.views.admin.charities import CharityDetailView
from api.views.admin.charities import CharityLogoUploadView
from api.views.admin.donors import DonorListView
from api.views.admin.donors import DonorDetailView
from api.views.admin.donors import DonorLogoUploadView
from api.views.admin.donors import DonorVideoUploadView
from api.views.admin.donors import DonorProductListView
from api.views.admin.products import ProductDetailView
from api.views.admin.products import ProductMediumUploadView
from api.views.admin.products import ProductMediumDeleteView
from api.views.admin.products import ProductListView


urlpatterns = [
    # charities api endpoints
    url(r'^charities/$', CharityListView.as_view(), name='charity-list'),
    url(r'^charities/(?P<pk>[0-9]+)/$', CharityDetailView.as_view(), name='charity-detail'),
    url(r'^charities/(?P<pk>[0-9]+)/logo/$', CharityLogoUploadView.as_view(), name='charity-logo'),

    # donors api endpoints
    url(r'^donors/$', DonorListView.as_view(), name='donor-list'),
    url(r'^donors/(?P<pk>[0-9]+)/$', DonorDetailView.as_view(), name='donor-detail'),
    url(r'^donors/(?P<pk>[0-9]+)/logo/$', DonorLogoUploadView.as_view(), name='donor-logo'),
    url(r'^donors/(?P<pk>[0-9]+)/video/$', DonorVideoUploadView.as_view(), name='donor-video'),
    url(r'^donors/(?P<pk>[0-9]+)/products/$', DonorProductListView.as_view(), name='donor-product-list'),

    # products api endpoints
    url(r'^products/$', ProductListView.as_view(), name='product-list'),
    url(r'^products/(?P<pk>[0-9]+)/$', ProductDetailView.as_view(), name='product-detail'),
    url(r'^products/(?P<pk>[0-9]+)/media/$', ProductMediumUploadView.as_view(), name='product-medium'),
    url(
        r'^products/(?P<pk>[0-9]+)/media/(?P<pm_pk>[0-9]+)/$',
        ProductMediumDeleteView.as_view(),
        name='product-medium-delete'
    ),
]
