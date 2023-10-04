from rest_framework import permissions

class IsSuperuserPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if the user making the request is a superuser
        return request.user.is_superuser

class IsSuperuserOrAuthorPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Check if the user is a superuser or the author of the product
        return request.user.is_superuser or request.user == obj.author