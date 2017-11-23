from rest_framework import generics
from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.filters.category import CategoryFilterBackend
from api.serializers.blog import PostCommentSerializer
from api.serializers.blog import PostDetailSerializer
from api.serializers.blog import PostSerializer
from api.paginations import TenPerPagePagination
from api.paginations import TwoPerPagePagination
from api.permissions import CommentPermission
from api.permissions import IsAdmin
from blog.constants import POST_VISIBILITY_PUBLIC
from blog.constants import COMMENT_STATUS_PUBLIC
from blog.models import Post
from blog.models import Comment


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


class PostCommentListView(generics.ListCreateAPIView):
    lookup_url_kwarg = 'pk'
    queryset = Post.objects.all()
    serializer_class = PostCommentSerializer
    permission_classes = [CommentPermission]

    def create(self, request, *args, **kwargs):
        serializer = PostCommentSerializer(
            data=request.data,
            context=self.get_serializer_context()
        )
        serializer.is_valid(raise_exception=True)
        comment = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        serializer = PostCommentSerializer(
            self.get_object().comment_set.select_related('user'),
            many=True
        )
        return Response(serializer.data)
