from rest_framework.pagination import PageNumberPagination


class EightPerPagePagination(PageNumberPagination):
    page_size = 8


class TwelvePerPagePagination(PageNumberPagination):
    page_size = 1  ### 12
