from django.db import models
import uuid



class AuditLog(models.Model):
    """
    Journal d'audit : toutes les actions importantes sont enregistrées.
    Permet de savoir qui a fait quoi et quand.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # L'utilisateur qui a effectué l'action
    user = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='audit_logs',
        verbose_name="Utilisateur"
    )
    
    # La demande concernée (si applicable)
    application = models.ForeignKey(
        'visa_applications.VisaApplication',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='audit_logs',
        verbose_name="Demande"
    )

    # Description de l'action
    action = models.CharField(
        max_length=100,
        verbose_name="Action"
    )
    description = models.TextField(
        blank=True,
        verbose_name="Description"
    )

    # Données avant et après la modification (pour l'historique)
    data_before = models.JSONField(
        null=True,
        blank=True,
        verbose_name="Données avant"
    )
    data_after = models.JSONField(
        null=True,
        blank=True,
        verbose_name="Données après"
    )

    # Informations techniques
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        verbose_name="Adresse IP"
    )
    user_agent = models.TextField(
        null=True,
        blank=True,
        verbose_name="User Agent"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date"
    )

    class Meta:
        db_table = 'audit_log'
        verbose_name = 'Journal d\'audit'
        verbose_name_plural = 'Journal d\'audit'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['application']),
            models.Index(fields=['action']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        user_str = self.user.email if self.user else "Système"
        return f"[{self.created_at:%d/%m/%Y %H:%M}] {user_str} - {self.action}"

# Create your models here.
