from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from apps.evisa.models import BorderCrossing
from django.core.mail import send_mail
from django.conf import settings

class Command(BaseCommand):
    help = "Envoie des rappels aux demandeurs 1 semaine avant la fin de leur séjour."

    def handle(self, *args, **options):
        # On cible les entrées (ENTRY) qui n'ont pas encore de sortie liée
        # et dont la date de sortie prévue est dans exactement 7 jours.
        reminder_date = timezone.now().date() + timedelta(days=7)
        
        entries_to_remind = BorderCrossing.objects.filter(
            crossing_type='ENTRY',
            linked_exit__isnull=True,
            expected_exit_date=reminder_date
        ).select_related('evisa', 'evisa__application', 'evisa__application__applicant')

        count = 0
        for entry in entries_to_remind:
            applicant = entry.evisa.application.applicant
            applicant_name = entry.evisa.application.full_name
            
            subject = "Rappel : Fin de séjour approchante au Cameroun"
            message = (
                f"Bonjour {applicant_name},\n\n"
                f"Ceci est un rappel automatique concernant votre séjour au Cameroun.\n"
                f"Votre date de départ prévue est le {entry.expected_exit_date.strftime('%d/%m/%Y')}, soit dans une semaine.\n\n"
                f"Nous vous prions de bien vouloir prendre les dispositions nécessaires pour respecter cette date.\n"
                f"Services de l'Immigration, République du Cameroun"
            )
            
            try:
                send_mail(
                    subject, message, settings.DEFAULT_FROM_EMAIL, [applicant.email],
                    fail_silently=False
                )
                self.stdout.write(self.style.SUCCESS(f"Rappel envoyé à {applicant.email}"))
                count += 1
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Erreur d'envoi à {applicant.email}: {e}"))

        self.stdout.write(self.style.SUCCESS(f"Terminé. {count} rappels envoyés."))
