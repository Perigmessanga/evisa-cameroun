"""
App Biometrics — Modèle, Serializer, View
Gestion de la capture biométrique faciale.
"""
import uuid
import base64
from django.db import models
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, serializers

from evisa_backend.utils import api_response


# ─── MODÈLE ───────────────────────────────────────────────────────
def biometric_upload_path(instance, filename):
    return f'biometrics/{instance.application_id}/{filename}'


class BiometricData(models.Model):
    id                = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application       = models.OneToOneField(
        'visa_applications.VisaApplication',
        on_delete=models.CASCADE, related_name='biometric_data'
    )
    face_image        = models.ImageField(upload_to=biometric_upload_path, verbose_name='Photo faciale')
    passport_photo    = models.ImageField(upload_to=biometric_upload_path, null=True, blank=True, verbose_name='Photo Passeport')
    face_encoding     = models.JSONField(default=dict, verbose_name='Encodage facial')
    quality_score     = models.FloatField(null=True, blank=True, verbose_name='Score qualité')
    liveness_verified = models.BooleanField(default=False, verbose_name='Vivacité vérifiée')
    is_verified       = models.BooleanField(default=False, verbose_name='Vérifié par agent')
    captured_at       = models.DateTimeField(auto_now_add=True)
    verified_at       = models.DateTimeField(null=True, blank=True)
    verified_by       = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='verified_biometrics'
    )

    class Meta:
        db_table     = 'evisa_biometric'
        verbose_name = 'Données biométriques'

    def __str__(self):
        return f'Biométrie — {self.application.application_number}'


# ─── SERIALIZER ───────────────────────────────────────────────────
class BiometricDataSerializer(serializers.ModelSerializer):
    class Meta:
        model  = BiometricData
        fields = [
            'id', 'face_image', 'passport_photo', 'quality_score',
            'liveness_verified', 'is_verified', 'captured_at',
        ]
        read_only_fields = ['id', 'quality_score', 'liveness_verified', 'is_verified', 'captured_at']


class CaptureBiometricSerializer(serializers.Serializer):
    """
    Reçoit la photo en base64 depuis le frontend.
    Le traitement biométrique (détection vivacité, encodage)
    est fait côté frontend avec face-api.js, puis envoyé ici.
    """
    application_id   = serializers.UUIDField()
    face_image_base64 = serializers.CharField(
        help_text='Image JPEG/PNG encodée en base64'
    )
    liveness_verified = serializers.BooleanField(default=False)
    quality_score     = serializers.FloatField(min_value=0, max_value=1, required=False)
    face_encoding     = serializers.JSONField(required=False, default=dict)
    passport_photo_base64 = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    def validate_face_image_base64(self, value):
        # Vérifier que c'est bien du base64 valide
        try:
            # Supprimer le préfixe data:image/...;base64,
            if ',' in value:
                value = value.split(',')[1]
            base64.b64decode(value)
        except Exception:
            raise serializers.ValidationError('Image base64 invalide.')
        return value


# ─── VIEWS ────────────────────────────────────────────────────────
class CaptureBiometricView(APIView):
    """
    Endpoint pour soumettre les données biométriques.
    Le frontend (React) capture la photo via webcam,
    effectue la détection de vivacité avec face-api.js,
    puis envoie les données ici.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        from apps.visa_applications.models import VisaApplication
        from django.core.files.base import ContentFile

        serializer = CaptureBiometricSerializer(data=request.data)
        if not serializer.is_valid():
            return api_response(errors=serializer.errors, status_code=status.HTTP_400_BAD_REQUEST)

        data       = serializer.validated_data
        app_id     = data['application_id']

        # Vérifier que la demande appartient à l'utilisateur
        try:
            application = VisaApplication.objects.get(pk=app_id, applicant=request.user)
        except VisaApplication.DoesNotExist:
            return api_response(message='Demande introuvable.', status_code=status.HTTP_404_NOT_FOUND)

        if application.status != 'DRAFT':
            return api_response(
                message='La biométrie ne peut être soumise que pour une demande en brouillon.',
                status_code=status.HTTP_400_BAD_REQUEST
            )

        # Vérification de la vivacité (obligatoire)
        if not data.get('liveness_verified', False):
            return api_response(
                message='La vérification de vivacité a échoué. Veuillez réessayer.',
                status_code=status.HTTP_400_BAD_REQUEST
            )

        # Décoder et sauvegarder l'image
        img_b64 = data['face_image_base64']
        if ',' in img_b64:
            img_b64 = img_b64.split(',')[1]
        img_bytes = base64.b64decode(img_b64)

        # Créer ou mettre à jour les données biométriques
        biometric, created = BiometricData.objects.update_or_create(
            application=application,
            defaults={
                'face_encoding':     data.get('face_encoding', {}),
                'quality_score':     data.get('quality_score', 0.0),
                'liveness_verified': data['liveness_verified'],
            }
        )
        biometric.face_image.save(
            f'face_{application.application_number}.jpg',
            ContentFile(img_bytes),
            save=True
        )

        # Gérer la photo passeport si fournie
        passport_b64 = data.get('passport_photo_base64')
        if passport_b64:
            if ',' in passport_b64:
                passport_b64 = passport_b64.split(',')[1]
            try:
                pass_bytes = base64.b64decode(passport_b64)
                biometric.passport_photo.save(
                    f'passport_{application.application_number}.jpg',
                    ContentFile(pass_bytes),
                    save=True
                )
            except Exception:
                pass

        return api_response(
            data=BiometricDataSerializer(biometric).data,
            message='Données biométriques enregistrées avec succès.',
            status_code=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )


class VerifyBiometricView(APIView):
    """
    Permet à un agent de vérifier les données biométriques.
    Compare la photo soumise avec la photo du passeport.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, application_id):
        from django.utils import timezone
        from apps.visa_applications.models import VisaApplication

        if not request.user.is_agent and not request.user.is_admin:
            return api_response(message='Accès refusé.', status_code=status.HTTP_403_FORBIDDEN)

        try:
            application = VisaApplication.objects.get(pk=application_id)
            biometric   = application.biometric_data
        except (VisaApplication.DoesNotExist, BiometricData.DoesNotExist):
            return api_response(message='Données introuvables.', status_code=status.HTTP_404_NOT_FOUND)

        biometric.is_verified = True
        biometric.verified_by = request.user
        biometric.verified_at = timezone.now()
        biometric.save(update_fields=['is_verified', 'verified_by', 'verified_at'])

        # Mettre à jour la demande de visa
        application.has_biometrics = True
        application.save(update_fields=['has_biometrics'])

        return api_response(
            data=BiometricDataSerializer(biometric).data,
            message='Biométrie validée.'
        )