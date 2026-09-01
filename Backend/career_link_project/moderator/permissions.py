from rest_framework.permissions import BasePermission


class IsJobSeeker(BasePermission):
    message = "Only job seekers can perform this action."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "js"
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