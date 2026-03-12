from rest_framework import serializers
from apps.evisa.models import EVisa, BorderCrossing


class EVisaSerializer(serializers.ModelSerializer):
    """
    Serializer pour afficher un e-visa.
    """
    is_valid = serializers.BooleanField(read_only=True)
    days_until_expiry = serializers.IntegerField(read_only=True)
    applicant_name = serializers.CharField(
        source='application.full_name',
        read_only=True
    )

    class Meta:
        model = EVisa
        fields = [
            'id', 'application', 'visa_number',
            'applicant_name', 'issue_date', 'expiry_date',
            'qr_code', 'pdf_file_path', 'is_revoked',
            'is_valid', 'days_until_expiry', 'created_at'
        ]
        read_only_fields = fields


class EVisaRevokeSerializer(serializers.Serializer):
    """
    Serializer pour révoquer un e-visa.
    """
    revocation_reason = serializers.CharField(required=True)


class BorderCrossingSerializer(serializers.ModelSerializer):
    """
    Serializer pour enregistrer un passage frontière.
    """
    evisa_number = serializers.CharField(
        source='evisa.visa_number',
        read_only=True
    )
    agent_name = serializers.CharField(
        source='border_agent.get_full_name',
        read_only=True
    )

    class Meta:
        model = BorderCrossing
        fields = [
            'id', 'evisa', 'evisa_number', 'border_agent',
            'agent_name', 'crossing_type', 'location',
            'crossing_date', 'notes'
        ]
        read_only_fields = ['id', 'crossing_date']


class BorderCrossingCreateSerializer(serializers.ModelSerializer):
    """
    Serializer pour créer un enregistrement de passage.
    """
    class Meta:
        model = BorderCrossing
        fields = ['evisa', 'crossing_type', 'location', 'notes']


class EVisaVerifySerializer(serializers.Serializer):
    """
    Serializer pour vérifier un e-visa par QR code ou numéro.
    """
    visa_number = serializers.CharField(required=False)
    qr_code_data = serializers.CharField(required=False)

    def validate(self, attrs):
        if not attrs.get('visa_number') and not attrs.get('qr_code_data'):
            raise serializers.ValidationError(
                "Vous devez fournir soit le numéro de visa, soit les données du QR code."
            )
        return attrs