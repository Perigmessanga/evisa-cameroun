"""
WSGI config for evisa_backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/wsgi/
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "evisa_backend.settings")

application = get_wsgi_application()

# --- PURGE DE SIMULATION APRES CHARGEMENT DE LA WEB APP ---
try:
    from django.conf import settings
    from django.contrib.auth import get_user_model
    import django.utils.timezone
    User = get_user_model()
    
    with open('/home/charles237/wsgi_debug.log', 'w', encoding='utf-8') as log_f:
        log_f.write(f"=== WSGI BOOT DIAGNOSTIC ===\n")
        log_f.write(f"Date/Heure : {django.utils.timezone.now()}\n")
        
        db_config = settings.DATABASES.get('default', {})
        log_f.write(f"Active DB Engine : {db_config.get('ENGINE')}\n")
        log_f.write(f"Active DB Name : {db_config.get('NAME')}\n")
        log_f.write(f"Active DB Host : {db_config.get('HOST')}\n")
        log_f.write(f"Active DB User : {db_config.get('USER')}\n")
        
        # Purge
        emails = ['messangacharles@icloud.com', 'messangaperig3@gmail.com']
        for email in emails:
            u = User.objects.filter(email=email).first()
            if u:
                log_f.write(f"Found user to purge: {email}\n")
                # Supprimer les demandes
                from apps.visa_applications.models import VisaApplication
                apps_cnt = VisaApplication.objects.filter(applicant=u).delete()[0]
                log_f.write(f"  -> Deleted {apps_cnt} visa applications\n")
                
                # Supprimer le user
                u.delete()
                log_f.write(f"  -> Deleted user successfully\n")
            else:
                log_f.write(f"User not found in this DB: {email}\n")
except Exception as wsgi_err:
    try:
        with open('/home/charles237/wsgi_debug.log', 'a', encoding='utf-8') as log_f:
            log_f.write(f"ERROR: {wsgi_err}\n")
    except:
        pass
# ----------------------------------------------------------
