"""
Modèle User personnalisé — Plateforme e-Visa Cameroun
"""
import uuid
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models


class UserRole(models.TextChoices):
    APPLICANT = 'APPLICANT', 'Demandeur de Visa'
    AGENT     = 'AGENT',     'Agent d\'Immigration'
    ADMIN     = 'ADMIN',     'Administrateur'
    EMBASSY   = 'EMBASSY',   'Ambassade/Consulat'
    BORDER    = 'BORDER',    'Agent Contrôle Frontières'


class UserManager(BaseUserManager):
    """Manager personnalisé — utilise l'email comme identifiant."""

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('L\'email est obligatoire.')
        email = self.normalize_email(email)
        extra_fields.setdefault('role', UserRole.APPLICANT)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('role', UserRole.ADMIN)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_email_verified', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Modèle utilisateur central.
    Couvre tous les acteurs : demandeurs, agents, admins, ambassades, frontières.
    """
    id                   = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email                = models.EmailField(unique=True, verbose_name='Email')
    first_name           = models.CharField(max_length=100, verbose_name='Prénom')
    last_name            = models.CharField(max_length=100, verbose_name='Nom')
    phone                = models.CharField(max_length=20, blank=True, null=True, verbose_name='Téléphone')
    role                 = models.CharField(max_length=20, choices=UserRole.choices, default=UserRole.APPLICANT, verbose_name='Rôle')

    # Statuts
    is_active            = models.BooleanField(default=True, verbose_name='Actif')
    is_staff             = models.BooleanField(default=False)
    is_email_verified    = models.BooleanField(default=False, verbose_name='Email vérifié')
    two_factor_enabled   = models.BooleanField(default=False, verbose_name='2FA activé')
    two_factor_secret    = models.CharField(max_length=255, blank=True, null=True)

    # Dates
    created_at           = models.DateTimeField(auto_now_add=True, verbose_name='Date création')
    updated_at           = models.DateTimeField(auto_now=True, verbose_name='Dernière modification')
    last_login           = models.DateTimeField(null=True, blank=True, verbose_name='Dernière connexion')

    objects = UserManager()

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        db_table    = 'evisa_user'
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role']),
        ]

    def __str__(self):
        return f'{self.get_full_name()} ({self.email})'

    def get_full_name(self):
        return f'{self.first_name} {self.last_name}'.strip()

    # ── Helpers de rôle ───────────────────────────────────────────
    @property
    def is_applicant(self): return self.role == UserRole.APPLICANT
    @property
    def is_agent(self):     return self.role == UserRole.AGENT
    @property
    def is_admin(self):     return self.role == UserRole.ADMIN
    @property
    def is_embassy(self):   return self.role == UserRole.EMBASSY
    @property
    def is_border_agent(self): return self.role == UserRole.BORDER