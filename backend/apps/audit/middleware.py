import json
from django.utils.deprecation import MiddlewareMixin
from .models import AuditLog

class AuditMiddleware(MiddlewareMixin):
    def _get_action_description(self, method, path, status_code):
        import re
        
        status_text = "Succès" if 200 <= status_code < 300 else "Échec"
        
        # Mapping simple par REGEX sur le path
        if re.search(r'/auth/login/?', path):
            return "Connexion au système", f"{status_text} (Code: {status_code}) - {method} {path}"
        elif re.search(r'/auth/register/?', path):
            return "Inscription utilisateur", f"{status_text} (Code: {status_code}) - {method} {path}"
        elif re.search(r'/visa_applications/[a-zA-Z0-9-]+/submit/?', path):
            return "Soumission de demande de visa", f"{status_text} - {method} {path}"
        elif re.search(r'/visa_applications/[a-zA-Z0-9-]+/update-status/?', path):
            return "Modification de statut de demande", f"{status_text} - {method} {path}"
        elif re.search(r'/visa_applications/types/?', path):
            if method == 'POST': return "Création d'un type de visa", f"{status_text} - {method} {path}"
            if method in ['PUT', 'PATCH']: return "Modification d'un type de visa", f"{status_text} - {method} {path}"
            if method == 'DELETE': return "Suppression d'un type de visa", f"{status_text} - {method} {path}"
        elif re.search(r'/users/?', path) and 'auth' not in path:
            if method == 'POST': return "Création manuelle d'un utilisateur", f"{status_text} - {method} {path}"
            if method in ['PUT', 'PATCH']: return "Modification d'utilisateur", f"{status_text} - {method} {path}"
            if method == 'DELETE': return "Suppression d'utilisateur", f"{status_text} - {method} {path}"
        elif re.search(r'/notifications/templates/?', path):
            if method == 'POST': return "Création d'un modèle d'e-mail", f"{status_text} - {method} {path}"
            if method in ['PUT', 'PATCH']: return "Modification d'un modèle d'e-mail", f"{status_text} - {method} {path}"
            if method == 'DELETE': return "Suppression d'un modèle d'e-mail", f"{status_text} - {method} {path}"
            
        return f"Appel API Système ({method})", f"{status_text} (Code: {status_code}) - {path}"

    def process_response(self, request, response):
        if request.user.is_authenticated and request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            action, description = self._get_action_description(
                request.method, request.path, response.status_code
            )
            
            try:
                AuditLog.objects.create(
                    user=request.user,
                    action=action,
                    description=description,
                    ip_address=request.META.get('REMOTE_ADDR'),
                    user_agent=request.META.get('HTTP_USER_AGENT')
                )
            except Exception as e:
                # Ne casse pas la requête HTTP en cas d'erreur de log
                pass

        return response
