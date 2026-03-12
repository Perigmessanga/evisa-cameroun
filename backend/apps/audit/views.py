from django.shortcuts import render

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser

from apps.audit.models import AuditLog
from apps.audit.serializers import AuditLogSerializer


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet pour consulter les logs d'audit (admin uniquement).
    GET /api/audit-logs/           - Liste tous les logs
    GET /api/audit-logs/{id}/      - Détails d'un log
    """
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        queryset = AuditLog.objects.all().order_by('-created_at')
        
        # Filtrer par utilisateur
        user_id = self.request.query_params.get('user_id')
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        
        # Filtrer par demande
        application_id = self.request.query_params.get('application_id')
        if application_id:
            queryset = queryset.filter(application_id=application_id)
        
        # Filtrer par action
        action = self.request.query_params.get('action')
        if action:
            queryset = queryset.filter(action__icontains=action)
        
        # Filtrer par date
        date_from = self.request.query_params.get('date_from')
        if date_from:
            queryset = queryset.filter(created_at__gte=date_from)
        
        date_to = self.request.query_params.get('date_to')
        if date_to:
            queryset = queryset.filter(created_at__lte=date_to)
        
        return queryset

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Statistiques des logs d'audit.
        GET /api/audit-logs/stats/
        """
        from django.db.models import Count
        
        stats_by_action = AuditLog.objects.values('action').annotate(
            count=Count('id')
        ).order_by('-count')[:10]
        
        stats_by_user = AuditLog.objects.exclude(
            user__isnull=True
        ).values('user__email').annotate(
            count=Count('id')
        ).order_by('-count')[:10]
        
        return Response({
            'total': AuditLog.objects.count(),
            'top_actions': list(stats_by_action),
            'top_users': list(stats_by_user),
        })

# Create your views here.
