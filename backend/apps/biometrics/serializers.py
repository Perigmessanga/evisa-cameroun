from rest_framework import serializers
from apps.biometrics.models import BiometricData


class BiometricDataSerializer(serializers.ModelSerializer):
    """
    Serializer pour afficher les données biométriques.
    """
    application_number = serializers.CharField(
        source='application.application_number',
        read_only=True
    )
    face_image_url = serializers.ImageField(source='face_image', read_only=True)

    class Meta:
        model = BiometricData
        fields = [
            'id', 'application', 'application_number',
            'face_image_url', 'quality_score',
            'liveness_verified', 'is_verified',
            'captured_at', 'verified_at'
        ]
        read_only_fields = [
            'id', 'quality_score',
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
        Créer les données biométriques sans pop face_image!
        """
        validated_data['face_encoding'] = {}
        return super().create(validated_data)


class BiometricVerificationSerializer(serializers.Serializer):
    """
    Serializer pour la vérification biométrique par un agent.
    """
    is_verified = serializers.BooleanField()