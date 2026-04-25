from .models import AuditLog

def log_action(user, action, application=None, description="", data_before=None, data_after=None, request=None):
    """
    Utilitaire centralisé pour enregistrer une action dans le journal d'audit.
    """
    ip_address = None
    user_agent = ""
    
    if request:
        # Extraire l'IP
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip_address = x_forwarded_for.split(',')[0]
        else:
            ip_address = request.META.get('REMOTE_ADDR')
        
        # Extraire le User Agent
        user_agent = request.META.get('HTTP_USER_AGENT', '')

    return AuditLog.objects.create(
        user=user,
        application=application,
        action=action,
        description=description,
        data_before=data_before,
        data_after=data_after,
        ip_address=ip_address,
        user_agent=user_agent
    )
