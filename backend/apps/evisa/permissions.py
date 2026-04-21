from rest_framework.permissions import BasePermission
from django.conf import settings
from apps.evisa.models import SystemSetting


class MaintenanceModePermission(BasePermission):
    """
    Permission globale qui bloque l'accès à l'API si le mode maintenance
    est activé, à l'exception des routes d'authentification et des
    utilisateurs ayant le rôle Administrateur.
    """
    
    def has_permission(self, request, view):
        # 1. Toujours autoriser les endpoints publics vitaux
        # e.g., login JWT, media, ou route de status publique
        path = request.path
        
        # On autorise les chemins de connexion/refresh
        if any(path.startswith(prefix) for prefix in [
            '/api/token/', 
            '/api/v1/token/', 
            '/api/v1/users/login', 
            '/api/v1/auth/'
        ]):
            return True
            
        # On autorise le status du système pour que le frontend sache
        if path.startswith('/api/system-settings/status/') or path.startswith('/api/v1/system-settings/status/'):
            return True
            
        # 2. Vérifier si le mode maintenance est actif
        try:
            maintenance_setting = SystemSetting.objects.get(key='maintenanceMode')
            is_maintenance_active = (maintenance_setting.value == 'true')
        except SystemSetting.DoesNotExist:
            is_maintenance_active = False

        if not is_maintenance_active:
            return True # Tout fonctionne normalement
            
        # 3. Si maintenance active, on laisse passer SEULEMENT les administrateurs
        if request.user and request.user.is_authenticated and getattr(request.user, 'role', '') == 'ADMIN':
            return True
            
        # Sinon on bloque l'accès
        return False
