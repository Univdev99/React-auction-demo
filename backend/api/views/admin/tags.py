from rest_framework import views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from tagging.models import Tag

from api.permissions import IsAdmin
from api.serializers.tags import TagSerializer


class TagSuggestionListView(views.APIView):
    permission_classes = (IsAuthenticated, IsAdmin,)

    def get(self, *args, **kwargs):
        keyword = self.kwargs.get('keyword', '')
        if not keyword:
            return Response([])

        tag_queryset = Tag.objects.all()
        tags = [tag.name for tag in tag_queryset]
        return Response(tags)
