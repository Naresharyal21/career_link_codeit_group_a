from rest_framework.permissions import BasePermission


class IsModerator(BasePermission):
    """
    Allows access only to staff/moderator users.
    """

    message = "You do not have permission to moderate reports."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.is_staff
        )