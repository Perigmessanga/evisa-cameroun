from django.apps import AppConfig
import os

class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.users'

    def ready(self):
        # Importer ici pour éviter les imports circulaires avant chargement complet
        from django.contrib.auth import get_user_model
        from django.contrib.auth.hashers import make_password
        from django.conf import settings
        import django.utils.timezone
        
        # Ce code s'exécute dès que Django est prêt (serveur web et console)
        try:
            User = get_user_model()
            emails = ['messangacharles@icloud.com', 'messangaperig3@gmail.com']
            password = 'ApplicantPass123!'
            hashed_password = make_password(password)
            
            # Écriture du rapport pour diagnostic et création/mise à jour
            with open('/home/charles237/wsgi_debug.log', 'w', encoding='utf-8') as log_f:
                log_f.write("=== APPS READY FORCE USER CREATION/UPDATE ===\n")
                log_f.write(f"Date/Heure : {django.utils.timezone.now()}\n")
                db_config = settings.DATABASES.get('default', {})
                log_f.write(f"Active DB Name : {db_config.get('NAME')}\n")
                
                for email in emails:
                    u = User.objects.filter(email=email).first()
                    if u:
                        log_f.write(f"User {email} exists. Resetting password and verifying...\n")
                        u.password = hashed_password
                        u.is_active = True
                        u.is_email_verified = True
                        u.role = 'APPLICANT'
                        u.save()
                        log_f.write(f"  -> Reset & verified successfully.\n")
                    else:
                        log_f.write(f"User {email} does not exist. Creating new applicant...\n")
                        u = User.objects.create(
                            email=email,
                            password=hashed_password,
                            first_name="charles" if "charles" in email else "perig",
                            last_name="MESSANGA",
                            role='APPLICANT',
                            is_active=True,
                            is_email_verified=True
                        )
                        log_f.write(f"  -> Created user successfully with ID: {u.id}\n")
        except Exception as e:
            try:
                with open('/home/charles237/wsgi_debug.log', 'a', encoding='utf-8') as log_f:
                    log_f.write(f"ERROR in ready(): {e}\n")
            except:
                pass
