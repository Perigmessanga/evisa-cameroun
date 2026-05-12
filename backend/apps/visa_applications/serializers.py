"""
Serializers — App visa_applications
"""
from django.utils import timezone
from rest_framework import serializers


from apps.users.serializers import UserSerializer
from .models import (
    VisaType, VisaApplication, Document, ApplicationComment, 
    SecurityAlert, StayExtensionRequest
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
        if obj.file:
            if request:
                return request.build_absolute_uri(obj.file.url)
            # Fallback if no request context
            from django.conf import settings
            return f"{settings.BASE_BACKEND_URL.rstrip('/')}{obj.file.url}"
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
    processed_by_name = serializers.SerializerMethodField()

    class Meta:
        model  = VisaApplication
        fields = [
            'id', 'application_number', 'applicant_name',
            'visa_type_name', 'status', 'full_name',
            'nationality', 'submitted_at', 'assigned_agent_name',
            'processed_by_name', 'created_at', 'processed_at', 'last_completed_step',
            'group_reference', 'is_group_primary', 'processing_type', 'border_check_status',
        ]

    def get_assigned_agent_name(self, obj):
        return obj.assigned_agent.get_full_name() if obj.assigned_agent else None

    def get_processed_by_name(self, obj):
        return obj.processed_by.get_full_name() if obj.processed_by else None


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
    biometric_photos = serializers.SerializerMethodField()
    payment_status = serializers.SerializerMethodField()

    class Meta:
        model  = VisaApplication
        fields = [
            'id', 'application_number', 'applicant', 'visa_type',
            'assigned_agent', 'status',
            # Personal
            'full_name', 'date_of_birth', 'place_of_birth', 'nationality', 
            'residence_country', 'gender', 'marital_status', 'profession', 'birth_country',
            # Passport
            'passport_number', 'passport_issue_date', 'passport_expiry_date', 'passport_country',
            # Travel
            'purpose_of_visit', 'arrival_date', 'departure_date', 'address_in_cameroon',
            # Emergency
            'emergency_contact_name', 'emergency_contact_phone',
            'national_id_number',
            # Processing
            'submitted_at', 'processed_at', 'rejection_reason',
            # Relations
            'documents', 'comments', 'evisa',
            'has_biometrics', 'biometric_photos', 'payment_status',
            'created_at', 'updated_at', 'last_completed_step',
            'group_reference', 'is_group_primary', 'processing_type', 'border_check_status',
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

    def get_biometric_photos(self, obj):
        if hasattr(obj, 'biometric_data'):
            request = self.context.get('request')
            bio = obj.biometric_data
            from django.conf import settings
            base_url = settings.BASE_BACKEND_URL.rstrip('/') if hasattr(settings, 'BASE_BACKEND_URL') else ''
            
            face_url = None
            if bio.face_image:
                face_url = request.build_absolute_uri(bio.face_image.url) if request else f"{base_url}{bio.face_image.url}"
            else:
                # Fallback: Search for 'PHOTO' document
                photo_doc = obj.documents.filter(document_type='PHOTO').first()
                if photo_doc and photo_doc.file:
                    face_url = request.build_absolute_uri(photo_doc.file.url) if request else f"{base_url}{photo_doc.file.url}"
                
            passport_url = None
            if bio.passport_photo:
                passport_url = request.build_absolute_uri(bio.passport_photo.url) if request else f"{base_url}{bio.passport_photo.url}"
            else:
                # Fallback: Search for 'PASSPORT' or 'PHOTO' document in uploaded files
                passport_doc = obj.documents.filter(document_type__in=['PASSPORT', 'PHOTO']).first()
                if passport_doc and passport_doc.file:
                    passport_url = request.build_absolute_uri(passport_doc.file.url) if request else f"{base_url}{passport_doc.file.url}"
                
            return {
                'face_image': face_url,
                'passport_photo': passport_url,
            }
        return None

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
            'marital_status', 'profession', 'birth_country',
            # Passport
            'passport_number', 'passport_issue_date', 'passport_expiry_date', 'passport_country',
            # Travel
            'purpose_of_visit', 'arrival_date', 'departure_date', 'address_in_cameroon',
            # Emergency
            'emergency_contact_name', 'emergency_contact_phone',
            'national_id_number',
            # Group
            'group_reference', 'is_group_primary',
            'processing_type',
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
    documents = DocumentSerializer(many=True, read_only=True)

    class Meta:
        model = VisaApplication
        fields = '__all__'  # ou liste de champs explicite
        read_only_fields = ['id', 'created_at', 'updated_at']

# Serializer pour update partiel ou complet
class VisaApplicationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisaApplication
        fields = [
            'id', 'visa_type',
            'full_name', 'date_of_birth', 'place_of_birth', 'nationality', 'gender',
            'marital_status', 'profession', 'birth_country',
            'passport_number', 'passport_issue_date', 'passport_expiry_date', 'passport_country',
            'purpose_of_visit', 'arrival_date', 'departure_date', 'address_in_cameroon',
            'emergency_contact_name', 'emergency_contact_phone',
            'national_id_number',
            'group_reference', 'is_group_primary', 'processing_type',
        ]

    def validate(self, attrs):
        today = timezone.now().date()
        
        if attrs.get('passport_expiry_date') and attrs['passport_expiry_date'] <= today:
            raise serializers.ValidationError({'passport_expiry_date': 'Le passeport est expiré.'})
            
        if attrs.get('arrival_date') and attrs['arrival_date'] < today:
            raise serializers.ValidationError({'arrival_date': 'La date d\'arrivée doit être dans le futur.'})
            
        if attrs.get('arrival_date') and attrs.get('departure_date'):
            if attrs['departure_date'] <= attrs['arrival_date']:
                raise serializers.ValidationError({'departure_date': 'La date de départ doit être après l\'arrivée.'})
        return attrs


class VisaApplicationStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=['SUBMITTED', 'PROCESSING', 'APPROVED', 'REJECTED', 'PAYMENT_PENDING'])
    rejection_reason = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        if attrs.get('status') == 'REJECTED' and not attrs.get('rejection_reason'):
            raise serializers.ValidationError({'rejection_reason': 'Le motif de rejet est obligatoire en cas de rejet.'})
        return attrs
    


# ─────────────────────────────────────────────────────────────────
# PROROGATION DE SÉJOUR
# ─────────────────────────────────────────────────────────────────
class StayExtensionSerializer(serializers.ModelSerializer):
    visa_application_number = serializers.CharField(source='visa_application.application_number', read_only=True)
    applicant_name = serializers.CharField(source='applicant.get_full_name', read_only=True)
    assigned_agent_name = serializers.SerializerMethodField()
    extension_proof_url = serializers.SerializerMethodField()

    class Meta:
        model = StayExtensionRequest
        fields = [
            'id', 'visa_application', 'visa_application_number', 
            'applicant', 'applicant_name', 'assigned_agent', 'assigned_agent_name',
            'current_expiry_date', 'requested_days', 'new_expiry_date',
            'reason', 'status', 'rejection_reason', 'payment_status',
            'extension_proof', 'extension_proof_url',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'payment_status', 'created_at', 'updated_at']

    def get_assigned_agent_name(self, obj):
        return obj.assigned_agent.get_full_name() if obj.assigned_agent else None

    def get_extension_proof_url(self, obj):
        if obj.extension_proof:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.extension_proof.url)
            return obj.extension_proof.url
        return None


class StayExtensionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StayExtensionRequest
        fields = [
            'visa_application', 'requested_days', 'reason', 'extension_proof'
        ]

    def validate(self, attrs):
        visa_app = attrs['visa_application']
        
        # Vérifier si la demande est approuvée
        if visa_app.status != 'APPROVED':
            raise serializers.ValidationError("Seules les demandes de visa approuvées peuvent être prorogées.")
        
        # Vérifier si l'utilisateur a déjà une prorogation en cours
        if StayExtensionRequest.objects.filter(
            visa_application=visa_app, 
            status__in=['SUBMITTED', 'PROCESSING', 'PENDING_PAYMENT']
        ).exists():
            raise serializers.ValidationError("Une demande de prorogation est déjà en cours pour ce visa.")
        
        # Vérifier si l'utilisateur est entré sur le territoire
        if visa_app.border_check_status != 'ENTERED':
            raise serializers.ValidationError("Vous devez être entré sur le territoire pour demander une prorogation.")
        
        return attrs

    def create(self, validated_data):
        visa_app = validated_data['visa_application']
        
        # Récupérer l'e-visa pour avoir la date d'expiration actuelle
        if not hasattr(visa_app, 'evisa'):
             raise serializers.ValidationError("E-visa introuvable pour cette demande.")
             
        current_expiry = visa_app.evisa.expiry_date
        validated_data['current_expiry_date'] = current_expiry
        
        # Calculer la nouvelle date d'expiration
        from datetime import timedelta
        validated_data['new_expiry_date'] = current_expiry + timedelta(days=validated_data['requested_days'])
        
        # Assigner l'agent d'origine
        validated_data['assigned_agent'] = visa_app.assigned_agent
        
        validated_data['applicant'] = self.context['request'].user
        
        return super().create(validated_data)
