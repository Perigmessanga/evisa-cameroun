from django.core.management.base import BaseCommand
from apps.notifications.models import EmailTemplate

MOCK_TEMPLATES = [
    {
        'code': 'AUTH_WELCOME',
        'name': 'Confirmation de Création de Compte',
        'type': EmailTemplate.TemplateType.AUTH,
        'language': 'FR',
        'is_active': True,
        'subject': 'Bienvenue sur e-Visa Cameroun !',
        'body_text': 'Bonjour {{ user_name }}, \n\nVotre compte a bien été créé avec succès.\n{{ verification_link }}\n\nCordialement,\nL\'équipe e-Visa',
        'body_html': '<p>Bonjour {{ user_name }}, <br><br>Votre compte a bien été créé avec succès.<br><a href="{{ verification_link }}">Vérifier mon email</a><br><br>Cordialement,<br>L\'équipe e-Visa</p>'
    },
    {
        'code': 'APP_SUBMIT',
        'name': 'Soumission de Demande de Visa',
        'type': EmailTemplate.TemplateType.APPLICATION,
        'language': 'FR',
        'is_active': True,
        'subject': 'Demande {{ application_number }} — Soumise avec succès',
        'body_text': 'Bonjour {{ user_name }}, \n\nVotre demande de visa n° {{ application_number }} a bien été soumise et est en cours de traitement.\n\nCordialement,\nL\'équipe e-Visa',
        'body_html': '<p>Bonjour {{ user_name }}, <br><br>Votre demande de visa n° <strong>{{ application_number }}</strong> a bien été soumise et est en cours de traitement.<br><br>Cordialement,<br>L\'équipe e-Visa</p>'
    },
    {
        'code': 'APP_APPROVE',
        'name': 'Visa Approuvé (E-Visa Join)',
        'type': EmailTemplate.TemplateType.APPLICATION,
        'language': 'FR',
        'is_active': True,
        'subject': 'Félicitations, votre Visa {{ application_number }} est approuvé !',
        'body_text': 'Bonjour {{ user_name }}, \n\nVotre visa a été approuvé. Veuillez vous connecter pour télécharger votre e-Visa.\n\nCordialement,\nL\'équipe e-Visa',
        'body_html': '<p>Bonjour {{ user_name }}, <br><br>Votre visa a été approuvé. Veuillez vous connecter pour télécharger votre e-Visa.<br><br>Cordialement,<br>L\'équipe e-Visa</p>'
    },
    {
        'code': 'DOC_REQUEST',
        'name': 'Demande de Documents Supplémentaires',
        'type': EmailTemplate.TemplateType.APPLICATION,
        'language': 'FR',
        'is_active': True,
        'subject': 'Action requise : Documents manquants pour la demande {{ application_number }}',
        'body_text': 'Bonjour {{ user_name }}, \n\nVeuillez vous connecter pour fournir les documents supplémentaires requis :\n\n{{ agent_message }}\n\nCordialement,\nL\'équipe e-Visa',
        'body_html': '<p>Bonjour {{ user_name }}, <br><br>Veuillez vous connecter pour fournir les documents supplémentaires requis :<br><br><em>{{ agent_message }}</em><br><br>Cordialement,<br>L\'équipe e-Visa</p>'
    },
    {
        'code': 'APP_REJECT',
        'name': 'Demande de Visa Refusée',
        'type': EmailTemplate.TemplateType.APPLICATION,
        'language': 'FR',
        'is_active': True,
        'subject': 'Demande {{ application_number }} — Refusée',
        'body_text': 'Bonjour {{ user_name }}, \n\nNous avons le regret de vous informer que votre demande de visa n° {{ application_number }} a été refusée.\n\nMotif : {{ rejection_reason }}\n\nCordialement,\nL\'équipe e-Visa',
        'body_html': '<p>Bonjour {{ user_name }}, <br><br>Nous avons le regret de vous informer que votre demande de visa n° <strong>{{ application_number }}</strong> a été refusée.<br><br>Motif : <strong>{{ rejection_reason }}</strong><br><br>Cordialement,<br>L\'équipe e-Visa</p>'
    },
]

class Command(BaseCommand):
    help = 'Seed email templates into the database'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding email templates...')
        created_count = 0
        for tpl_data in MOCK_TEMPLATES:
            obj, created = EmailTemplate.objects.get_or_create(
                code=tpl_data['code'],
                defaults=tpl_data
            )
            if created:
                created_count += 1
            else:
                for key, value in tpl_data.items():
                    setattr(obj, key, value)
                obj.save()
                
        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {len(MOCK_TEMPLATES)} templates ({created_count} newly created).'))
