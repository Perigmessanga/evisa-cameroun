from rest_framework import serializers
from apps.notifications.models import Notification, AuditLog


class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer pour afficher une notification.
    """
    is_read = serializers.BooleanField(read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'subject', 'message',
            'status', 'sent_at', 'read_at', 'is_read',
            'created_at'
        ]
        read_only_fields = fields


class NotificationMarkReadSerializer(serializers.Serializer):
    """
    Serializer pour marquer une notification comme lue.
    """
    pass  # Pas de champs nécessaires, l'action suffit


class AuditLogSerializer(serializers.ModelSerializer):
    """
    Serializer pour afficher les logs d'audit.
    """
    user_email = serializers.EmailField(source='user.email', read_only=True)
    application_number = serializers.CharField(
        source='application.application_number',
        read_only=True,
        allow_null=True
    )

    class Meta:
        model = AuditLog
        fields = [
            'id', 'user', 'user_email', 'application',
            'application_number', 'action', 'description',
            'data_before', 'data_after', 'ip_address',
            'created_at'
        ]
        read_only_fields = fields