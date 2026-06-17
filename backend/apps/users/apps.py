from django.apps import AppConfig
import os

class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.users'

    def ready(self):
        # Importer ici pour éviter les imports circulaires avant chargement complet
        from django.contrib.auth import get_user_model
        from django.conf import settings
        import django.utils.timezone
        
        # Ce code s'exécute dès que Django est prêt (serveur web et console)
        try:
            User = get_user_model()
            emails = ['messangacharles@icloud.com', 'messangaperig3@gmail.com']
            
            # Écriture du rapport pour diagnostic
            with open('/home/charles237/wsgi_debug.log', 'w', encoding='utf-8') as log_f:
                log_f.write("=== APPS READY PURGE DIAGNOSTIC ===\n")
                log_f.write(f"Date/Heure : {django.utils.timezone.now()}\n")
                db_config = settings.DATABASES.get('default', {})
                log_f.write(f"Active DB Engine : {db_config.get('ENGINE')}\n")
                log_f.write(f"Active DB Name : {db_config.get('NAME')}\n")
                log_f.write(f"Active DB Host : {db_config.get('HOST')}\n")
                
                for email in emails:
                    u = User.objects.filter(email=email).first()
                    if u:
                        log_f.write(f"Found user to purge: {email}\n")
                        # Supprimer les demandes de visa liées d'abord
                        from apps.visa_applications.models import VisaApplication
                        apps_cnt = VisaApplication.objects.filter(applicant=u).delete()[0]
                        log_f.write(f"  -> Deleted {apps_cnt} visa applications\n")
                        u.delete()
                        log_f.write(f"  -> Deleted user successfully\n")
                    else:
                        log_f.write(f"User not found in this DB: {email}\n")
        except Exception as e:
            try:
                with open('/home/charles237/wsgi_debug.log', 'a', encoding='utf-8') as log_f:
                    log_f.write(f"ERROR in ready(): {e}\n")
            except:
                pass
