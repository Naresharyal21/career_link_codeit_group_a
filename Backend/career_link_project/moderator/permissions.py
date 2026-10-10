from rest_framework.permissions import BasePermission, SAFE_METHODS


def has_moderator_access(user):
    return user.is_staff or user.is_superuser


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
                or has_moderator_access(request.user)
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
            and has_moderator_access(request.user)
        )


class IsAdminOrOwnerReadOnly(BasePermission):
    """
    Used on report list/detail views, together with a queryset that is
    already scoped to what the requesting user is allowed to see:
      - employers only see reports on jobs they posted
      - job seekers only see reports they filed themselves

    Admins (is_staff) get full read/write/delete access.

    Employers get read-only access to reports on their own jobs.

    Job seekers get read-only access to reports they filed —
    except they can also edit (PATCH/PUT) their own report while
    it's still Pending, before a moderator has started reviewing
    it. Once review starts (or it's Resolved/Rejected), it's
    locked for them. Deleting a report is admin-only regardless
    of status.
    """

    message = "Only admins can update or delete reports."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        # The real decision happens in has_object_permission, once
        # we actually have the report — staff always get through
        # here, everyone else is narrowed further below.
        return True

    def has_object_permission(self, request, view, obj):
        if has_moderator_access(request.user):
            return True

        if request.method in SAFE_METHODS:
            return True

        if (
            request.method in ("PATCH", "PUT")
            and obj.reported_by_id == request.user.id
            and obj.status == "Pending"
        ):
            return True

        return False