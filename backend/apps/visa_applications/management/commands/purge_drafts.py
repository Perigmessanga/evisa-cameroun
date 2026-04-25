from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from apps.visa_applications.models import VisaApplication, ApplicationStatus

class Command(BaseCommand):
    help = 'Supprime les brouillons (DRAFT) datant de plus de 30 jours pour libérer la base de données.'

    def handle(self, *args, **options):
        threshold = timezone.now() - timedelta(days=30)
        
        # Trouver les brouillons dont la dernière modification est supérieure à 30 jours
        drafts = VisaApplication.objects.filter(
            status=ApplicationStatus.DRAFT,
            updated_at__lt=threshold
        )
        
        count = drafts.count()
        if count > 0:
            drafts.delete()
            self.stdout.write(self.style.SUCCESS(f'{count} brouillons expirés supprimés avec succès.'))
        else:
            self.stdout.write(self.style.SUCCESS('Aucun brouillon expiré à supprimer.'))
