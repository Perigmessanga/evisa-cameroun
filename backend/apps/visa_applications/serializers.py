"""
Serializers — App visa_applications
"""
from django.utils import timezone
from rest_framework import serializers


from apps.users.serializers import UserSerializer
from .models import (
    VisaType, VisaApplication, Document, ApplicationComment, 
    SecurityAlert
)
from apps.evisa.serializers import EVisaSerializer 

# ─────────────────────────────────────────────────────────────────
# TYPE DE VISA
# ─────────────────────────────────────────────────────────────────
class VisaTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model  = VisaType
        fields = [
            'id', 'name', 'code', 'description',
            'validity_days', 'max_stay_days', 'fee',
            'required_documents', 'processing_time_days', 'is_active',
        ]


# ─────────────────────────────────────────────────────────────────
# DOCUMENT
# ─────────────────────────────────────────────────────────────────
class DocumentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model  = Document
        fields = [
            'id', 'document_type', 'file', 'file_url',
            'file_name', 'file_size', 'mime_type',
            'is_verified', 'uploaded_at',
        ]
        read_only_fields = ['id', 'file_name', 'file_size', 'mime_type', 'is_verified', 'uploaded_at']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None

    def validate_file(self, value):
        # Max 5 MB par document
        max_size = 5 * 1024 * 1024
        if value.size > max_size:
            raise serializers.ValidationError('Le fichier ne doit pas dépasser 5 MB.')
        allowed_types = ['image/jpeg', 'image/png', 'application/pdf']
        if value.content_type not in allowed_types:
            raise serializers.ValidationError('Format non supporté. Acceptés : JPEG, PNG, PDF.')
        return value

    def create(self, validated_data):
        file = validated_data['file']
        validated_data['file_name'] = file.name
        validated_data['file_size'] = file.size
        validated_data['mime_type'] = file.content_type
        return super().create(validated_data)


# ─────────────────────────────────────────────────────────────────
# COMMENTAIRE
# ─────────────────────────────────────────────────────────────────
class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()

    class Meta:
        model  = ApplicationComment
        fields = ['id', 'author', 'author_name', 'content', 'is_internal', 'created_at']
        read_only_fields = ['id', 'author', 'created_at']

    def get_author_name(self, obj):
        return obj.author.get_full_name()


# ─────────────────────────────────────────────────────────────────
# DEMANDE DE VISA — LISTE (résumé)
# ─────────────────────────────────────────────────────────────────
class ApplicationListSerializer(serializers.ModelSerializer):
    visa_type_name    = serializers.CharField(source='visa_type.name', read_only=True)
    applicant_name    = serializers.CharField(source='applicant.get_full_name', read_only=True)
    assigned_agent_name = serializers.SerializerMethodField()

    class Meta:
        model  = VisaApplication
        fields = [
            'id', 'application_number', 'applicant_name',
            'visa_type_name', 'status', 'full_name',
            'nationality', 'submitted_at', 'assigned_agent_name',
            'created_at',
        ]

    def get_assigned_agent_name(self, obj):
        return obj.assigned_agent.get_full_name() if obj.assigned_agent else None


# ─────────────────────────────────────────────────────────────────
# DEMANDE DE VISA — DÉTAIL COMPLET
# ─────────────────────────────────────────────────────────────────
class ApplicationDetailSerializer(serializers.ModelSerializer):
    visa_type      = VisaTypeSerializer(read_only=True)
    applicant      = UserSerializer(read_only=True)
    assigned_agent = UserSerializer(read_only=True)
    documents      = DocumentSerializer(many=True, read_only=True)
    comments       = serializers.SerializerMethodField()
    evisa          = serializers.SerializerMethodField()
    has_biometrics = serializers.SerializerMethodField()
    payment_status = serializers.SerializerMethodField()

    class Meta:
        model  = VisaApplication
        fields = [
            'id', 'application_number', 'applicant', 'visa_type',
            'assigned_agent', 'status',
            # Personal
            'full_name', 'date_of_birth', 'place_of_birth', 'nationality', 
            'residence_country', 'gender',
            # Passport
            'passport_number', 'passport_issue_date', 'passport_expiry_date', 'passport_country',
            # Travel
            'purpose_of_visit', 'arrival_date', 'departure_date', 'address_in_cameroon',
            # Processing
            'submitted_at', 'processed_at', 'rejection_reason',
            # Relations
            'documents', 'comments', 'evisa',
            'has_biometrics', 'payment_status',
            'created_at', 'updated_at',
        ]

    def get_comments(self, obj):
        user = self.context['request'].user
        # Les demandeurs ne voient pas les commentaires internes
        qs = obj.comments.all()
        if user.is_applicant:
            qs = qs.filter(is_internal=False)
        return CommentSerializer(qs, many=True).data

    def get_evisa(self, obj):
        if hasattr(obj, 'evisa'):
            return EVisaSerializer(obj.evisa).data
        return None

    def get_has_biometrics(self, obj):
        return hasattr(obj, 'biometric_data')

    def get_payment_status(self, obj):
        if hasattr(obj, 'payment'):
            return obj.payment.status
        return None


# ─────────────────────────────────────────────────────────────────
# CRÉATION D'UNE DEMANDE
# ─────────────────────────────────────────────────────────────────
class CreateApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model  = VisaApplication
        fields = [
            'id',
            'visa_type',
            # Personal
            'full_name', 'date_of_birth', 'place_of_birth', 'nationality', 'gender',
            # Passport
            'passport_number', 'passport_issue_date', 'passport_expiry_date', 'passport_country',
            # Travel
            'purpose_of_visit', 'arrival_date', 'departure_date', 'address_in_cameroon',
        ]
        read_only_fields = ['id']

    def validate(self, attrs):
        today = timezone.now().date()

        # Le passeport ne doit pas être expiré
        if attrs.get('passport_expiry_date') and attrs['passport_expiry_date'] <= today:
            raise serializers.ValidationError({'passport_expiry_date': 'Le passeport est expiré.'})

        # La date d'arrivée doit être dans le futur
        if attrs.get('arrival_date') and attrs['arrival_date'] < today:
            raise serializers.ValidationError({'arrival_date': 'La date d\'arrivée doit être dans le futur.'})

        # La date de départ doit être après l'arrivée
        if attrs.get('arrival_date') and attrs.get('departure_date'):
            if attrs['departure_date'] <= attrs['arrival_date']:
                raise serializers.ValidationError({'departure_date': 'La date de départ doit être après la date d\'arrivée.'})

        return attrs


# ─────────────────────────────────────────────────────────────────
# E-VISA
# ─────────────────────────────────────────────────────────────────
#


# ─────────────────────────────────────────────────────────────────
# PASSAGE FRONTIÈRE
# ─────────────────────────────────────────────────────────────────
#


# ─────────────────────────────────────────────────────────────────
# ACTIONS AGENT (approbation / rejet)
# ─────────────────────────────────────────────────────────────────
class ApproveApplicationSerializer(serializers.Serializer):
    notes = serializers.CharField(required=False, allow_blank=True)


class RejectApplicationSerializer(serializers.Serializer):
    reason = serializers.CharField(required=True, min_length=10,
                                   error_messages={'required': 'Le motif de rejet est obligatoire.',
                                                   'min_length': 'Le motif doit comporter au moins 10 caractères.'})


class RequestDocumentsSerializer(serializers.Serializer):
    message = serializers.CharField(required=True,
                                    error_messages={'required': 'Le message est obligatoire.'})


class ApplicationCommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationComment
        fields = ['content', 'is_internal']


class SecurityAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecurityAlert
        fields = '__all__'


# Serializer principal pour GET (détail) et PUT complet
class VisaApplicationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # inclut les infos utilisateur
    visa_type = VisaTypeSerializer(read_only=True)
    documents = serializers.StringRelatedField(many=True, read_only=True)  # ou DocumentSerializer si tu veux détaillé

    class Meta:
        model = VisaApplication
        fields = '__all__'  # ou liste de champs explicite
        read_only_fields = ['id', 'created_at', 'updated_at']

# Serializer pour update partiel ou complet
class VisaApplicationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisaApplication
        # ici tu peux choisir les champs modifiables par l'update
        fields = ['status', 'remark', 'visa_type']  
        # status = par exemple "approved", "rejected", etc.
    


