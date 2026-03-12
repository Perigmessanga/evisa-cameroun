from rest_framework import serializers
from apps.audit.models import AuditLog


class AuditLogSerializer(serializers.ModelSerializer):
    """
    Serializer pour afficher les logs d'audit.
    """
    user_email = serializers.EmailField(
        source='user.email', 
        read_only=True,
        allow_null=True
    )
    user_name = serializers.CharField(
        source='user.get_full_name',
        read_only=True,
        allow_null=True
    )
    application_number = serializers.CharField(
        source='application.application_number',
        read_only=True,
        allow_null=True
    )

    class Meta:
        model = AuditLog
        fields = [
            'id', 'user', 'user_email', 'user_name',
            'application', 'application_number', 
            'action', 'description',
            'data_before', 'data_after', 
            'ip_address', 'user_agent',
            'created_at'
        ]
        read_only_fields = fields