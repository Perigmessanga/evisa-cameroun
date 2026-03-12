from rest_framework import serializers
from apps.biometrics.models import BiometricData


class BiometricDataSerializer(serializers.ModelSerializer):
    """
    Serializer pour afficher les données biométriques.
    """
    quality_label = serializers.CharField(read_only=True)
    application_number = serializers.CharField(
        source='application.application_number',
        read_only=True
    )

    class Meta:
        model = BiometricData
        fields = [
            'id', 'application', 'application_number',
            'face_image_path', 'quality_score', 'quality_label',
            'liveness_verified', 'is_verified',
            'captured_at', 'verified_at'
        ]
        read_only_fields = [
            'id', 'quality_score', 'quality_label',
            'is_verified', 'captured_at', 'verified_at'
        ]


class BiometricDataCreateSerializer(serializers.ModelSerializer):
    """
    Serializer pour créer/uploader des données biométriques.
    """
    face_image = serializers.ImageField(write_only=True)

    class Meta:
        model = BiometricData
        fields = ['application', 'face_image']

    def validate_application(self, value):
        """Vérifier que la demande n'a pas déjà de données biométriques."""
        if hasattr(value, 'biometric_data'):
            raise serializers.ValidationError(
                "Cette demande a déjà des données biométriques."
            )
        return value

    def create(self, validated_data):
        """
        Créer les données biométriques.
        Le traitement de l'image (encodage facial, détection de vivacité)
        sera fait dans la vue.
        """
        face_image = validated_data.pop('face_image')
        
        # Sauvegarder l'image (à implémenter selon votre stockage : local ou S3)
        # Pour l'instant, on simule juste le chemin
        validated_data['face_image_path'] = f"biometrics/{face_image.name}"
        validated_data['face_encoding'] = {}  # À remplir avec face-api.js
        
        return super().create(validated_data)


class BiometricVerificationSerializer(serializers.Serializer):
    """
    Serializer pour la vérification biométrique par un agent.
    """
    is_verified = serializers.BooleanField()