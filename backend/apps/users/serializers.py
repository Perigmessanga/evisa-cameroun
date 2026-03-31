"""
Serializers — App Users
"""
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, UserRole


# ─────────────────────────────────────────────────────────────────
# INSCRIPTION
# ─────────────────────────────────────────────────────────────────
class RegisterSerializer(serializers.ModelSerializer):
    password         = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model  = User
        fields = ['email', 'first_name', 'last_name', 'phone', 'password', 'confirm_password']

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Les mots de passe ne correspondent pas.'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(
            email      = validated_data['email'],
            password   = validated_data['password'],
            first_name = validated_data['first_name'],
            last_name  = validated_data['last_name'],
            phone      = validated_data.get('phone', ''),
            role       = UserRole.APPLICANT,
        )
        return user


# ─────────────────────────────────────────────────────────────────
# CONNEXION
# ─────────────────────────────────────────────────────────────────
class LoginSerializer(serializers.Serializer):
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(username=attrs['email'], password=attrs['password'])

        if not user:
            raise serializers.ValidationError('Email ou mot de passe incorrect.')
        if not user.is_active:
            raise serializers.ValidationError('Ce compte a été désactivé.')
        if not user.is_email_verified:
            raise serializers.ValidationError('Veuillez vérifier votre email avant de vous connecter.')

        attrs['user'] = user
        return attrs


# ─────────────────────────────────────────────────────────────────
# PROFIL UTILISATEUR
# ─────────────────────────────────────────────────────────────────
class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model  = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name',
            'phone', 'role', 'is_active', 'is_email_verified',
            'two_factor_enabled', 'created_at', 'last_login',
        ]
        read_only_fields = ['id', 'email', 'role', 'created_at', 'last_login']

    def get_full_name(self, obj):
        return obj.get_full_name()


class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['first_name', 'last_name', 'phone']

    def validate_phone(self, value):
        if value and not value.startswith('+'):
            raise serializers.ValidationError('Le numéro doit commencer par le code pays (ex: +237...).')
        return value


# ─────────────────────────────────────────────────────────────────
# CHANGEMENT DE MOT DE PASSE
# ─────────────────────────────────────────────────────────────────
class ChangePasswordSerializer(serializers.Serializer):
    old_password     = serializers.CharField(write_only=True)
    new_password     = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Les mots de passe ne correspondent pas.'})
        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('L\'ancien mot de passe est incorrect.')
        return value


# ─────────────────────────────────────────────────────────────────
# GESTION ADMIN DES UTILISATEURS
# ─────────────────────────────────────────────────────────────────
class AdminUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model  = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'phone',
            'role', 'is_active', 'is_email_verified',
            'two_factor_enabled', 'created_at', 'last_login', 'password'
        ]
        read_only_fields = ['id', 'created_at', 'last_login']

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        return super().update(instance, validated_data)


class CreateUserByAdminSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model  = User
        fields = ['email', 'first_name', 'last_name', 'phone', 'role', 'password']

    def create(self, validated_data):
        validated_data['is_email_verified'] = True
        return User.objects.create_user(**validated_data)


class RoleUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['role']


# ─────────────────────────────────────────────────────────────────
# TOKEN RESPONSE (utilisé dans les views)
# ─────────────────────────────────────────────────────────────────
def get_tokens_for_user(user):
    """Génère les tokens JWT access + refresh pour un utilisateur."""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access':  str(refresh.access_token),
    }