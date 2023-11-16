from rest_framework import permissions


class IsManagerAchatPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_achat_manager


class IsAdminOrManagerAchatPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_achat_manager == True:
            return True
        if request.user.is_superuser == True:
            return True
        return False
