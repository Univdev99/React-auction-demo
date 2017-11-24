from datetime import timedelta

from django.urls import reverse
from django.utils import timezone

from rest_framework import status

from common.test import APITestCase
from account.test.factories import UserFactory
from blog.models import Comment
from blog.models import Post
from blog.test.factories import PostFactory
from blog.test.factories import CommentFactory


class CommentListViewTests(APITestCase):
    def setUp(self):
        super(CommentListViewTests, self).setUp()
        self.post = PostFactory.create()
        self.user = UserFactory.create()
        self.comments = [
            CommentFactory.create(post=self.post),
            CommentFactory.create(post=self.post),
        ]

    def test_create_comment(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            reverse('api:post-comments', kwargs=dict(pk=self.post.pk)),
            {'content': 'Test comment'}
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.content)
        self.client.logout()
        response = self.client.post(
            reverse('api:post-comments', kwargs=dict(pk=self.post.pk)),
            {'content': 'Test comment'}
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
