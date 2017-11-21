from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from api.filters.category import CategoryFilterBackend
from api.serializers.blog import PostSerializer
from api.paginations import TenPerPagePagination
from api.permissions import IsAdmin
from blog.models import Post


class PostListView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    queryset = Post.objects.order_by('-created_at') \
        .order_by('-is_sticky') \
        .select_related('featured_image')
    serializer_class = PostSerializer
    pagination_class = TenPerPagePagination
    filter_backends = (CategoryFilterBackend, )

    def get_serializer_context(self):
        return {
            'user': self.request.user,
        }


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, IsAdmin,)
    queryset = Post.objects.all().select_related('featured_image')
    serializer_class = PostSerializer
    lookup_url_kwarg = 'pk'

    def get_serializer_context(self):
        return {
            'user': self.request.user,
        }
