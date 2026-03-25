from rest_framework import serializers
from apps.notifications.models import Notification, EmailTemplate


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


        read_only_fields = fields


class EmailTemplateSerializer(serializers.ModelSerializer):
    """
    Serializer for email templates (CRUD by admin).
    """
    class Meta:
        model = EmailTemplate
        fields = [
            'id', 'name', 'code', 'type', 'subject',
            'body_text', 'body_html', 'language',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']