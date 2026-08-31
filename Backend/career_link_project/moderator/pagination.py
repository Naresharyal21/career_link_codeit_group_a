from rest_framework.pagination import PageNumberPagination


class ReportPagination(PageNumberPagination):
    """
    Pagination for the moderator Report list endpoint.

    Scoped to this app only (not set globally in REST_FRAMEWORK)
    so other list endpoints that the frontend still expects as
    flat arrays are not affected.
    """

    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100