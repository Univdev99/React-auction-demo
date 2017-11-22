from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from api.filters.category import CategoryFilterBackend
from api.serializers.blog import PostDetailSerializer
from api.serializers.blog import PostSerializer
from api.paginations import TenPerPagePagination
from api.paginations import TwoPerPagePagination
from api.permissions import IsAdmin
from blog.constants import POST_VISIBILITY_PUBLIC
from blog.models import Post


class PostFrontListView(generics.ListAPIView):
    queryset = Post.objects \
        .order_by('-created_at') \
        .order_by('-is_sticky') \
        .select_related('featured_image')[:2]
    serializer_class = PostSerializer
    filter_backends = (CategoryFilterBackend, )

    def get_serializer_context(self):
        return {
            'user': self.request.user,
        }


class PostListView(generics.ListAPIView):
    queryset = Post.objects \
        .order_by('-created_at') \
        .order_by('-is_sticky') \
        .select_related('featured_image')
    serializer_class = PostSerializer
    pagination_class = TenPerPagePagination
    filter_backends = (CategoryFilterBackend, )

    def get_serializer_context(self):
        return {
            'user': self.request.user,
        }


class PostDetailView(generics.RetrieveAPIView):
    queryset = Post.objects \
        .order_by('-created_at') \
        .order_by('-is_sticky') \
        .select_related('featured_image')
    serializer_class = PostDetailSerializer
    lookup_url_kwarg = 'pk'
