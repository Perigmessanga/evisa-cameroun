"""
Views Authentification — Plateforme e-Visa Cameroun
"""
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from evisa_backend.utils import api_response
from django.contrib.auth import get_user_model
from .serializers import (
    RegisterSerializer, LoginSerializer, ChangePasswordSerializer,
    UserSerializer, UpdateProfileSerializer, get_tokens_for_user
)

User = get_user_model()


# ─────────────────────────────────────────────────────────────────
# ADMIN USERS VIEWSET
# ─────────────────────────────────────────────────────────────────
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [IsAdminUser]

    def get_serializer_class(self):
        if self.action == 'create':
            from .serializers import CreateUserByAdminSerializer
            return CreateUserByAdminSerializer
        from .serializers import AdminUserSerializer
        return AdminUserSerializer

    @action(detail=True, methods=['post'])
    def suspend(self, request, pk=None):
        user = self.get_object()
        user.is_active = False
        user.save(update_fields=['is_active'])
        return api_response(message='Utilisateur suspendu avec succès.', data=UserSerializer(user).data)

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        user = self.get_object()
        user.is_active = True
        user.save(update_fields=['is_active'])
        return api_response(message='Utilisateur activé avec succès.', data=UserSerializer(user).data)

    @action(detail=True, methods=['post'])
    def update_role(self, request, pk=None):
        user = self.get_object()
        from .serializers import RoleUpdateSerializer
        serializer = RoleUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return api_response(message='Rôle mis à jour avec succès.', data=UserSerializer(user).data)
        return api_response(errors=serializer.errors, message='Données invalides.', status_code=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        from django.db.models import Sum
        from apps.visa_applications.models import VisaApplication
        from apps.evisa.models import EVisa
        
        users_count = User.objects.count()
        applications_count = VisaApplication.objects.count()
        evisas_count = EVisa.objects.count()
        
        # Revenus (somme des frais des visas approuvés)
        revenue = VisaApplication.objects.filter(status='APPROVED').aggregate(
            total=Sum('visa_type__fee')
        )['total'] or 0

        return api_response(data={
            'total_users': users_count,
            'total_applications': applications_count,
            'total_evisas': evisas_count,
            'total_revenue': revenue,
            'recent_users': UserSerializer(User.objects.order_by('-created_at')[:5], many=True).data
        })



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
        user.is_email_verified = False  # Toujours False à la création
        user.save(update_fields=['is_email_verified'])

        # Envoyer l'email de vérification
        verify_url = self._send_verification_email(user, request)

        return api_response(
            data={'email': user.email, 'verification_url': verify_url if settings.DEBUG else None},
            message='Inscription réussie. Vérifiez votre email pour activer votre compte.',
            status_code=status.HTTP_201_CREATED
        )

    def _send_verification_email(self, user, request):
        token = default_token_generator.make_token(user)
        uid   = urlsafe_base64_encode(force_bytes(user.pk))
        frontend_url = settings.BASE_FRONTEND_URL
        verify_url = f'{frontend_url}/auth/verify-email/{uid}/{token}'

        if settings.DEBUG:
            # En dev : affiche le lien dans la console (pas besoin de vraie boîte mail)
            print(f"\n{'='*60}")
            print(f"[DEV] LIEN DE VERIFICATION EMAIL")
            print(f"Utilisateur : {user.email}")
            print(f"URL         : {verify_url}")
            print(f"{'='*60}\n")

        try:
            from apps.notifications.models import NotificationService
            NotificationService.send_account_created(user, verify_url)
        except Exception as e:
            if settings.DEBUG:
                # En dev, l'échec d'envoi est acceptable car le lien est dans la console
                print(f"Erreur d'envoi email (autorisée en DEV) : {e}")
                print(f"[DEV] Email non envoyé (SMTP error): {e}")
            else:
                raise  # En production, propager l'erreur
        return verify_url


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
            # Extraire le message le plus pertinent (ex: email non vérifié)
            non_field_errors = serializer.errors.get('non_field_errors', [])
            message = str(non_field_errors[0]) if non_field_errors else 'Identifiants incorrects.'
            return api_response(
                errors=serializer.errors,
                message=message,
                status_code=status.HTTP_400_BAD_REQUEST
            )

        user = serializer.validated_data['user']

        # Vérifier que l'email est validé
        if not user.is_email_verified:
            return api_response(
                message='Veuillez vérifier votre email avant de vous connecter.',
                status_code=status.HTTP_400_BAD_REQUEST
            )

        # Mettre à jour la dernière connexion
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])

        tokens = get_tokens_for_user(user)

        return api_response(
            data={**tokens, 'user': UserSerializer(user).data},
            message='Connexion réussie.',
        )


# ─────────────────────────────────────────────────────────────────
# DÉCONNEXION
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
        # Répond toujours "succès" pour ne pas révéler l’existence du compte
        try:
            user = User.objects.get(email=email, is_active=True)
            token = default_token_generator.make_token(user)
            uid   = urlsafe_base64_encode(force_bytes(user.pk))
            frontend_url = settings.BASE_FRONTEND_URL
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