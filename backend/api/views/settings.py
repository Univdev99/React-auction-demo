from rest_framework.views import APIView
from rest_framework.response import Response

from common.constants import COUNTRY_CHOICES


class CountriesView(APIView):
    def get(self, *args, **kwargs):
        res = [{
           "code": c[0],
           "name": c[1]
        } for c in COUNTRY_CHOICES]
        return Response(res)
