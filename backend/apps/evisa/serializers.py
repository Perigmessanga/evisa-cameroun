# pyrefly: ignore [missing-import]
from rest_framework import serializers
# pyrefly: ignore [missing-import]
from apps.evisa.models import EVisa, BorderCrossing, SystemSetting, ContactMessage, Watchlist

class WatchlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Watchlist
        fields = '__all__'

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
    applicant_nationality = serializers.CharField(
        source='application.nationality',
        read_only=True
    )
    passport_number = serializers.CharField(
        source='application.passport_number',
        read_only=True
    )
    visa_type_name = serializers.CharField(
        source='application.visa_type.name',
        read_only=True
    )
    biometric_liveness_score = serializers.FloatField(
        source='application.biometric_liveness_score',
        read_only=True
    )
    live_photo = serializers.SerializerMethodField()
    passport_photo = serializers.SerializerMethodField()

    class Meta:
        model = EVisa
        fields = [
            'id', 'application', 'visa_number',
            'applicant_name', 'applicant_nationality', 'passport_number', 'visa_type_name',
            'issue_date', 'expiry_date',
            'qr_code', 'pdf_file_path', 'is_revoked',
            'is_valid', 'days_until_expiry', 'created_at',
            'biometric_liveness_score', 'live_photo', 'passport_photo'
        ]
        read_only_fields = fields

    def get_live_photo(self, obj):
        if obj.application.live_photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.application.live_photo.url)
            # pyrefly: ignore [missing-import]
            from django.conf import settings
            base_url = getattr(settings, 'BASE_BACKEND_URL', 'https://charles237.pythonanywhere.com')
            return f"{base_url.rstrip('/')}{obj.application.live_photo.url}"
        return None

    def get_passport_photo(self, obj):
        photo_doc = obj.application.documents.filter(document_type='PHOTO').first()
        if photo_doc and photo_doc.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(photo_doc.file.url)
            # pyrefly: ignore [missing-import]
            from django.conf import settings
            base_url = getattr(settings, 'BASE_BACKEND_URL', 'https://charles237.pythonanywhere.com')
            return f"{base_url.rstrip('/')}{photo_doc.file.url}"
        return None



class SystemSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSetting
        fields = ['key', 'value', 'category', 'description', 'updated_at']


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'
        read_only_fields = ['id', 'status', 'replied_by', 'reply_message', 'created_at', 'replied_at']


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
            'crossing_date', 'expected_exit_date', 'linked_exit', 'notes'
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