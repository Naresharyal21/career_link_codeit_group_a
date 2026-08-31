from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsJobSeeker(BasePermission):
    message = "Only job seekers can perform this action."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "js"
        )


class CanCreateReport(BasePermission):
    message = "Only job seekers and moderators can file a report."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and (
                request.user.role in ("js", "moderator", "admin")
                or request.user.is_staff
            )
        )


class IsEmployer(BasePermission):
    message = "Only employers can perform this action."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "ep"
        )


class IsModerator(BasePermission):
    message = "You do not have permission to moderate reports."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.is_staff
        )


class IsAdminOrOwnerReadOnly(BasePermission):
    """
    Used on report list/detail views, together with a queryset that is
    already scoped to what the requesting user is allowed to see:
      - employers only see reports on jobs they posted
      - job seekers only see reports they filed themselves

    Admins (is_staff) get full read/write access. Everyone else
    (employer or job seeker) gets read-only access to whatever the
    scoped queryset already limited them to.
    """

    message = "Only admins can update or delete reports."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_staff:
            return True
        return request.method in SAFE_METHODS