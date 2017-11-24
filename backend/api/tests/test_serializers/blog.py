from datetime import datetime
from datetime import timedelta
from unittest.mock import patch
from django.utils import timezone

from common.test import SerializerTestCase
from api.serializers.blog import PostSerializer
from api.serializers.blog import PostDetailSerializer
from api.serializers.blog import PostCommentSerializer
from account.test.factories import UserFactory
from blog.constants import POST_VISIBILITY_PUBLIC
from blog.constants import COMMENT_STATUS_PUBLIC
from blog.models import Comment
from blog.models import Post
from blog.test.factories import PostFactory
from blog.test.factories import CommentFactory


class PostSerializerTests(SerializerTestCase):
    serializer_class = PostSerializer

    def setUp(self):
        super(PostSerializerTests, self).setUp()

        self.post = PostFactory.create()
        self.comments = [
            CommentFactory.create(post=self.post),
            CommentFactory.create(post=self.post),
        ]
        self.post2 = PostFactory.create()

    def test_get_single(self):
        serializer = self.get_serializer(self.post)
        self.assertIn('pk', serializer.data)

    def test_get_list(self):
        post_queryset = Post.objects.all()
        serializer = self.get_serializer(post_queryset, many=True)
        self.assertEqual(len(serializer.data), 2)


class PostDetailSerializerTests(SerializerTestCase):
    serializer_class = PostDetailSerializer

    def setUp(self):
        super(PostDetailSerializerTests, self).setUp()

        self.post = PostFactory.create()
        self.comments = [
            CommentFactory.create(post=self.post),
            CommentFactory.create(post=self.post),
        ]

    def test_get_single(self):
        serializer = self.get_serializer(self.post)
        self.assertIn('pk', serializer.data)
        self.assertIn('similar_posts', serializer.data)


@patch('django.utils.timezone.now', return_value=timezone.make_aware(datetime(2017, 11, 1)))
class PostCommentSerializerTests(SerializerTestCase):
    serializer_class = PostCommentSerializer

    def setUp(self):
        super(PostCommentSerializerTests, self).setUp()
        self.user = UserFactory.create()
        self.post = PostFactory.create()
        self.comments = [
            CommentFactory.create(post=self.post),
            CommentFactory.create(post=self.post),
        ]

    def get_data(self):
        return {
            'content': 'Test comment'
        }

    def test_create_comment(self, mock_now):
        serializer = self.get_serializer(
            data=self.get_data(),
            user=self.user,
            model_object=self.post
        )
        self.assertValid(serializer)
        post = serializer.create(serializer.validated_data)
        self.assertIsNotNone(post)

    def test_get_comment_list(self, mock_now):
        serializer = self.get_serializer(self.post.comment_set,many=True)
        self.assertEqual(len(serializer.data), 2)
