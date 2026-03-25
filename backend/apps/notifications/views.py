from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.utils import timezone

from apps.notifications.models import Notification, EmailTemplate
from apps.audit.models import AuditLog
from apps.notifications.serializers import (
    NotificationSerializer,
    EmailTemplateSerializer,
)
from apps.audit.serializers import AuditLogSerializer


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet pour consulter les notifications.
    GET /api/notifications/           - Mes notifications
    GET /api/notifications/{id}/      - Détails d'une notification
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(
            user=self.request.user
        ).order_by('-created_at')

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """
        Marquer une notification comme lue.
        POST /api/notifications/{id}/mark-read/
        """
        notification = self.get_object()
        
        if notification.read_at is None:
            notification.read_at = timezone.now()
            notification.save()
        
        return Response({
            'message': 'Notification marquée comme lue.',
            'notification': NotificationSerializer(notification).data
        })

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """
        Marquer toutes les notifications comme lues.
        POST /api/notifications/mark-all-read/
        """
        count = Notification.objects.filter(
            user=request.user,
            read_at__isnull=True
        ).update(read_at=timezone.now())
        
        return Response({
            'message': f'{count} notification(s) marquée(s) comme lue(s).'
        })

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """
        Nombre de notifications non lues.
        GET /api/notifications/unread-count/
        """
        count = Notification.objects.filter(
            user=request.user,
            read_at__isnull=True
        ).count()
        
        return Response({'unread_count': count})


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
        
        return Response({
            'total': AuditLog.objects.count(),
            'top_actions': list(stats_by_action),
        })
# Create your views here.


class EmailTemplateViewSet(viewsets.ModelViewSet):
    """
    CRUD pour les modèles d'emails (admin uniquement).
    GET/POST  /api/v1/notifications/templates/
    GET/PATCH/DELETE /api/v1/notifications/templates/{id}/
    """
    queryset = EmailTemplate.objects.all().order_by('type', 'name')
    serializer_class = EmailTemplateSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        qs = super().get_queryset()
        # Optional filtering by type
        t = self.request.query_params.get('type')
        if t:
            qs = qs.filter(type=t)
        return qs

