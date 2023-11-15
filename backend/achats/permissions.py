from rest_framework import permissions


class IsManagerAchatPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_achat_manager


class IsAdminOrManagerAchatPermission(permissions.BasePermission):
    def has_object_permission(self, request, view):
        if request.user.is_superuser or request.user.is_achat_manager:
            return True
