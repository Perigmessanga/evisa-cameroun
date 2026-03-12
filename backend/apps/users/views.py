"""
Views Authentification — Plateforme e-Visa Cameroun
"""
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from evisa_backend.utils import api_response
from .models import User
from .serializers import (
    RegisterSerializer, LoginSerializer, ChangePasswordSerializer,
    UserSerializer, UpdateProfileSerializer, get_tokens_for_user
)

from rest_framework import viewsets
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from rest_framework.permissions import IsAdminUser


User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]


# ─────────────────────────────────────────────────────────────────
# INSCRIPTION
# ─────────────────────────────────────────────────────────────────
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return api_response(errors=serializer.errors,
                                message='Données invalides.',
                                status_code=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()

        # Envoyer l'email de vérification
        self._send_verification_email(user, request)

        return api_response(
            data={'email': user.email},
            message='Inscription réussie. Vérifiez votre email pour activer votre compte.',
            status_code=status.HTTP_201_CREATED
        )

    def _send_verification_email(self, user, request):
        token = default_token_generator.make_token(user)
        uid   = urlsafe_base64_encode(force_bytes(user.pk))
        frontend_url = settings.CORS_ALLOWED_ORIGINS[0] if settings.CORS_ALLOWED_ORIGINS else 'http://localhost:3000'
        verify_url = f'{frontend_url}/auth/verify-email?uid={uid}&token={token}'

        send_mail(
            subject='e-Visa Cameroun — Vérifiez votre email',
            message=f'Bonjour {user.get_full_name()},\n\nCliquez sur ce lien pour vérifier votre email :\n{verify_url}\n\nCe lien expire dans 24h.',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=True,
        )


# ─────────────────────────────────────────────────────────────────
# VÉRIFICATION EMAIL
# ─────────────────────────────────────────────────────────────────
class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uid   = request.data.get('uid')
        token = request.data.get('token')

        if not uid or not token:
            return api_response(message='UID et token requis.',
                                status_code=status.HTTP_400_BAD_REQUEST)
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user    = User.objects.get(pk=user_id)
        except (TypeError, ValueError, User.DoesNotExist):
            return api_response(message='Lien de vérification invalide.',
                                status_code=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return api_response(message='Lien expiré ou invalide.',
                                status_code=status.HTTP_400_BAD_REQUEST)

        user.is_email_verified = True
        user.save(update_fields=['is_email_verified'])

        tokens = get_tokens_for_user(user)
        return api_response(
            data={**tokens, 'user': UserSerializer(user).data},
            message='Email vérifié avec succès. Vous êtes maintenant connecté.',
        )


# ─────────────────────────────────────────────────────────────────
# CONNEXION
# ─────────────────────────────────────────────────────────────────
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return api_response(errors=serializer.errors,
                                message='Identifiants incorrects.',
                                status_code=status.HTTP_400_BAD_REQUEST)

        user = serializer.validated_data['user']

        # Mettre à jour la dernière connexion
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])

        tokens = get_tokens_for_user(user)

        return api_response(
            data={**tokens, 'user': UserSerializer(user).data},
            message='Connexion réussie.',
        )


# ─────────────────────────────────────────────────────────────────
# DÉCONNEXION (blacklist du refresh token)
# ─────────────────────────────────────────────────────────────────
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return api_response(message='Refresh token requis.',
                                status_code=status.HTTP_400_BAD_REQUEST)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            return api_response(message='Token invalide ou déjà révoqué.',
                                status_code=status.HTTP_400_BAD_REQUEST)

        return api_response(message='Déconnexion réussie.')


# ─────────────────────────────────────────────────────────────────
# RENOUVELLEMENT DU TOKEN
# ─────────────────────────────────────────────────────────────────
class TokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return api_response(message='Refresh token requis.',
                                status_code=status.HTTP_400_BAD_REQUEST)
        try:
            token  = RefreshToken(refresh_token)
            access = str(token.access_token)
        except TokenError as e:
            return api_response(message=str(e),
                                status_code=status.HTTP_401_UNAUTHORIZED)

        return api_response(data={'access': access})


# ─────────────────────────────────────────────────────────────────
# MON PROFIL
# ─────────────────────────────────────────────────────────────────
class MyProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return api_response(data=serializer.data)

    def patch(self, request):
        serializer = UpdateProfileSerializer(request.user, data=request.data, partial=True)
        if not serializer.is_valid():
            return api_response(errors=serializer.errors,
                                message='Données invalides.',
                                status_code=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return api_response(
            data=UserSerializer(request.user).data,
            message='Profil mis à jour avec succès.',
        )


# ─────────────────────────────────────────────────────────────────
# CHANGEMENT DE MOT DE PASSE
# ─────────────────────────────────────────────────────────────────
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return api_response(errors=serializer.errors,
                                message='Données invalides.',
                                status_code=status.HTTP_400_BAD_REQUEST)

        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save(update_fields=['password'])

        return api_response(message='Mot de passe modifié avec succès.')


# ─────────────────────────────────────────────────────────────────
# MOT DE PASSE OUBLIÉ
# ─────────────────────────────────────────────────────────────────
class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        # On répond toujours "succès" pour éviter la fuite d'infos
        try:
            user = User.objects.get(email=email, is_active=True)
            token = default_token_generator.make_token(user)
            uid   = urlsafe_base64_encode(force_bytes(user.pk))
            frontend_url = settings.CORS_ALLOWED_ORIGINS[0] if settings.CORS_ALLOWED_ORIGINS else 'http://localhost:3000'
            reset_url = f'{frontend_url}/auth/reset-password?uid={uid}&token={token}'

            send_mail(
                subject='e-Visa Cameroun — Réinitialisation de mot de passe',
                message=f'Bonjour {user.get_full_name()},\n\nCliquez ici pour réinitialiser votre mot de passe :\n{reset_url}\n\nCe lien expire dans 1h.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=True,
            )
        except User.DoesNotExist:
            pass

        return api_response(message='Si cet email existe, vous recevrez un lien de réinitialisation.')


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uid      = request.data.get('uid')
        token    = request.data.get('token')
        password = request.data.get('new_password')

        if not all([uid, token, password]):
            return api_response(message='Données manquantes.',
                                status_code=status.HTTP_400_BAD_REQUEST)
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user    = User.objects.get(pk=user_id)
        except (TypeError, ValueError, User.DoesNotExist):
            return api_response(message='Lien invalide.',
                                status_code=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return api_response(message='Lien expiré ou invalide.',
                                status_code=status.HTTP_400_BAD_REQUEST)

        user.set_password(password)
        user.save(update_fields=['password'])

        return api_response(message='Mot de passe réinitialisé avec succès.')