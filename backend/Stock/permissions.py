from rest_framework import permissions

class IsReceptionPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_reception



class IsStockV(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_reception or request.user.agent_affectation or request.user.is_superuser


class AffecterPer(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.agent_affectation

