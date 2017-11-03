from rest_framework.pagination import PageNumberPagination


class FourPerPagePagination(PageNumberPagination):
    page_size = 4


class EightPerPagePagination(PageNumberPagination):
    page_size = 8


class TenPerPagePagination(PageNumberPagination):
    page_size = 10


class TwelvePerPagePagination(PageNumberPagination):
    page_size = 12
