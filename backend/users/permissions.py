from rest_framework import permissions

class IsSuperuserPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if the user making the request is a superuser
        return request.user.is_superuser

class IsOwnerOrSuperuser(permissions.BasePermission):
    """
    Custom permission to only allow owners or superusers to edit the object.
    """

    def has_object_permission(self, request, view, obj):
        # Allow superusers to edit any object
        if request.user.is_superuser:
            return True

        # Allow users to edit their own account
        return obj == request.user