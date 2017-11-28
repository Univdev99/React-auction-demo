from django.conf.urls import url
from rest_framework_jwt.views import obtain_jwt_token

from api.views.admin.auctions import AuctionListView
from api.views.admin.auctions import AuctionDetailView
from api.views.admin.auctions import AuctionStartView
from api.views.admin.auctions import AuctionFinishView
from api.views.admin.auctions import AuctionCancelView
from api.views.admin.auctions import AuctionBidListView
from api.views.admin.auctions import AuctionBidStatusChangeView
from api.views.admin.auctions import SaleListView
from api.views.admin.auctions import SaleDetailView
from api.views.admin.auctions import SaleNoteView
from api.views.admin.auctions import AuctionBacklogListView
from api.views.admin.blog import PostListView
from api.views.admin.blog import PostDetailView
from api.views.admin.charities import CharityListView
from api.views.admin.charities import CharityDetailView
from api.views.admin.charities import CharityLogoUploadView
from api.views.admin.donors import DonorListView
from api.views.admin.donors import DonorDetailView
from api.views.admin.donors import DonorProductListView
from api.views.admin.donors import DonorMediumUploadView
from api.views.admin.donors import DonorMediumDeleteView
from api.views.admin.donors import DonorMediaReorderView
from api.views.admin.media import MediumListView
from api.views.admin.notifications import NotificationListForMenuView
from api.views.admin.notifications import NotificationListView
from api.views.admin.products import ProductDetailView
from api.views.admin.products import ProductMediumUploadView
from api.views.admin.products import ProductMediumDeleteView
from api.views.admin.products import ProductListView
from api.views.admin.products import ProductMediaReorderView
from api.views.admin.tags import TagSuggestionListView
from api.views.admin.users import UserBlockUnblockView
from api.views.admin.users import UserListView


urlpatterns = [
    # charities endpoints
    url(r'^charities/$', CharityListView.as_view(), name='charity-list'),
    url(r'^charities/(?P<pk>[0-9]+)/$', CharityDetailView.as_view(), name='charity-detail'),
    url(r'^charities/(?P<pk>[0-9]+)/logo/$', CharityLogoUploadView.as_view(), name='charity-logo'),

    # donors endpoints
    url(r'^donors/$', DonorListView.as_view(), name='donor-list'),
    url(r'^donors/(?P<pk>[0-9]+)/$', DonorDetailView.as_view(), name='donor-detail'),
    url(r'^donors/(?P<pk>[0-9]+)/products/$', DonorProductListView.as_view(), name='donor-product-list'),
    url(r'^donors/(?P<pk>[0-9]+)/media/$', DonorMediumUploadView.as_view(), name='donor-medium'),
    url(r'^donors/(?P<pk>[0-9]+)/media/(?P<dm_pk>[0-9]+)/$',
        DonorMediumDeleteView.as_view(), name='donor-medium-delete'),
    url(r'^donors/(?P<pk>[0-9]+)/media/reorder/$', DonorMediaReorderView.as_view(), name='donor-media-reorder'),

    # products endpoints
    url(r'^products/$', ProductListView.as_view(), name='product-list'),
    url(r'^products/(?P<pk>[0-9]+)/$', ProductDetailView.as_view(), name='product-detail'),
    url(r'^products/(?P<pk>[0-9]+)/media/$', ProductMediumUploadView.as_view(), name='product-medium'),
    url(r'^products/(?P<pk>[0-9]+)/media/(?P<pm_pk>[0-9]+)/$',
        ProductMediumDeleteView.as_view(), name='product-medium-delete'),
    url(r'^products/(?P<pk>[0-9]+)/media/reorder/$', ProductMediaReorderView.as_view(), name='product-media-reorder'),

    # auctions endpoints
    url(r'^auctions/$', AuctionListView.as_view(), name='auction-list'),
    url(r'^auctions/(?P<pk>[0-9]+)/$', AuctionDetailView.as_view(), name='auction-detail'),
    url(r'^auctions/(?P<pk>[0-9]+)/start/$', AuctionStartView.as_view(), name='auction-start'),
    url(r'^auctions/(?P<pk>[0-9]+)/finish/$', AuctionFinishView.as_view(), name='auction-finish'),
    url(r'^auctions/(?P<pk>[0-9]+)/cancel/$', AuctionCancelView.as_view(), name='auction-cancel'),
    url(r'^auctions/(?P<pk>[0-9]+)/bids/$', AuctionBidListView.as_view(), name='auction-bids'),
    url(r'^auctions/(?P<pk>[0-9]+)/bids/(?P<bid_pk>[0-9]+)/change-status/$',
        AuctionBidStatusChangeView.as_view(), name='auction-bid-status-change'),

    # tags endpoints
    url(r'^tags/suggest/(?P<keyword>[a-zA-Z0-9]+)/$', TagSuggestionListView.as_view(), name='tag-suggestion-list'),

    # users endpoints
    url(r'^users/$', UserListView.as_view(), name='user-list'),
    url(r'^users/(?P<pk>[0-9]+)/block/$', UserBlockUnblockView.as_view(), name='user-block-unblock'),

    # media endpoints
    url(r'^media/$', MediumListView.as_view(), name='medium-list'),

    # sales endpoints
    url(r'^sales/$', SaleListView.as_view(), name='sale-list'),
    url(r'^sales/(?P<pk>[0-9]+)/$', SaleDetailView.as_view(), name='sale-detail'),
    url(r'^sales/(?P<pk>[0-9]+)/note/$', SaleNoteView.as_view(), name='sale-note'),

    # posts endpoints
    url(r'^posts/$', PostListView.as_view(), name='post-list'),
    url(r'^posts/(?P<pk>[0-9]+)/$', PostDetailView.as_view(), name='post-detail'),

    # backlog endpoints
    url(r'^backlog/$', AuctionBacklogListView.as_view(), name='backlog'),

    # notification endpoints
    url(r'^notifications/menu/$', NotificationListForMenuView.as_view(), name='notification-list-for-menu'),
    url(r'^notifications/$', NotificationListView.as_view(), name='notification-list'),
]
