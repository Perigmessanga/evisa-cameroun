"""
Permissions personnalisées — Plateforme e-Visa Cameroun
"""
from rest_framework.permissions import BasePermission
from apps.users.models import UserRole


class IsApplicantOwner(BasePermission):
    """Le demandeur ne peut accéder qu'à ses propres données."""
    def has_object_permission(self, request, view, obj):
        return obj.applicant == request.user


class IsAgentOrAdmin(BasePermission):
    """Réservé aux agents d'immigration et administrateurs."""
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role in [UserRole.AGENT, UserRole.ADMIN]
        )


class IsAdminOnly(BasePermission):
    """Réservé aux administrateurs."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == UserRole.ADMIN


class IsEmbassy(BasePermission):
    """Réservé aux représentants des ambassades/consulats."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == UserRole.EMBASSY


class IsBorderAgent(BasePermission):
    """Réservé aux agents de contrôle aux frontières."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == UserRole.BORDER


class IsAgentAdminOrEmbassy(BasePermission):
    """Agents, admins et ambassades."""
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role in [UserRole.AGENT, UserRole.ADMIN, UserRole.EMBASSY]
        )