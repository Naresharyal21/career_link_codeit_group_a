from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from drf_spectacular.utils import (
    extend_schema,
    extend_schema_view,
    OpenApiParameter,
    OpenApiTypes,
    inline_serializer,
)
from rest_framework import serializers as drf_serializers

from .models import Notification
from .serializers import NotificationSerializer


class NotificationPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


@extend_schema_view(
    get=extend_schema(
        parameters=[
            OpenApiParameter(
                name="is_read",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                required=False,
                description=(
                    "Filter by read status. Must be exactly 'true' or 'false' "
                    "(case-insensitive); any other value returns 400."
                ),
                enum=["true", "false"],
            ),
        ],
    )
)
class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = NotificationPagination

    VALID_IS_READ_VALUES = {"true": True, "false": False}

    def get_queryset(self):
        queryset = Notification.objects.filter(user=self.request.user)
        is_read_param = self.request.query_params.get("is_read")
        if is_read_param is not None:
            normalized = is_read_param.lower()
            if normalized not in self.VALID_IS_READ_VALUES:
                raise ValidationError(
                    {"is_read": "Must be 'true' or 'false'."}
                )
            queryset = queryset.filter(is_read=self.VALID_IS_READ_VALUES[normalized])
        return queryset


class NotificationMarkReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        request=None,
        responses=NotificationSerializer,
        description=(
            "Marks a single notification as read. Idempotent: calling this on an "
            "already-read notification is a safe no-op and still returns it."
        ),
    )
    def patch(self, request, pk):
        notification = get_object_or_404(Notification, pk=pk, user=request.user)
        if not notification.is_read:
            notification.is_read = True
            notification.save(update_fields=["is_read"])
        serializer = NotificationSerializer(notification)
        return Response(serializer.data)


class NotificationDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        responses={204: None},
        description=(
            "Deletes a single notification belonging to the caller. "
            "Returns 404 if it doesn't exist or belongs to another user."
        ),
    )
    def delete(self, request, pk):
        notification = get_object_or_404(Notification, pk=pk, user=request.user)
        notification.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class NotificationMarkAllReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        request=None,
        responses=inline_serializer(
            name="MarkAllReadResponse",
            fields={
                "detail": drf_serializers.CharField(),
                "updated": drf_serializers.IntegerField(),
            },
        ),
    )
    def patch(self, request):
        updated_count = Notification.objects.filter(
            user=request.user, is_read=False
        ).update(is_read=True)
        return Response({"detail": "All notifications marked as read.", "updated": updated_count})


class NotificationClearReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        responses={
            200: inline_serializer(
                name="ClearReadResponse",
                fields={
                    "detail": drf_serializers.CharField(),
                    "deleted": drf_serializers.IntegerField(),
                },
            ),
        },
        description=(
            "Deletes every already-read notification for the caller and returns "
            "how many were removed. Returns 200 with a body, not 204."
        ),
    )
    def delete(self, request):
        deleted_count, _ = Notification.objects.filter(
            user=request.user, is_read=True
        ).delete()
        return Response(
            {"detail": "Read notifications cleared.", "deleted": deleted_count},
            status=status.HTTP_200_OK,
        )


class NotificationUnreadCountView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        responses=inline_serializer(
            name="UnreadCountResponse",
            fields={"unread_count": drf_serializers.IntegerField()},
        ),
    )
    def get(self, request):
        count = Notification.objects.filter(user=request.user, is_read=False).count()
        return Response({"unread_count": count})