from rest_framework import permissions

class IsManagerAchatPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_achat_manager