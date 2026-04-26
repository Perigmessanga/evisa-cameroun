import pyotp
import qrcode
import io
import base64
from rest_framework import views, status, permissions
from rest_framework.response import Response
from django.conf import settings

class TwoFactorSetupView(views.APIView):
    """
    Génère un secret TOTP et un QR Code pour l'utilisateur.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.two_factor_enabled:
            return Response({'error': '2FA est déjà activé.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Générer un secret unique si inexistant
        if not user.two_factor_secret:
            user.two_factor_secret = pyotp.random_base32()
            user.save(update_fields=['two_factor_secret'])
            
        totp = pyotp.TOTP(user.two_factor_secret)
        provisioning_url = totp.provisioning_uri(
            name=user.email, 
            issuer_name="e-Visa République du Cameroun"
        )
        
        # Générer QR Code Image
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(provisioning_url)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        qr_base64 = base64.b64encode(buffer.getvalue()).decode()
        
        return Response({
            'secret': user.two_factor_secret,
            'qr_code': f"data:image/png;base64,{qr_base64}"
        })

class TwoFactorVerifyView(views.APIView):
    """
    Vérifie le code et active définitivement le 2FA.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        
        user = request.user
        code = request.data.get('code')
        
        if not code:
            return Response({'error': 'Code requis.'}, status=status.HTTP_400_BAD_REQUEST)
            
        totp = pyotp.TOTP(user.two_factor_secret)
        if totp.verify(code):
            user.two_factor_enabled = True
            user.save(update_fields=['two_factor_enabled'])
            return Response({'message': '2FA activé avec succès.'})
        else:
            return Response({'error': 'Code invalide.'}, status=status.HTTP_400_BAD_REQUEST)

class TwoFactorDisableView(views.APIView):
    """
    Désactive le 2FA (nécessite un code valide ou mot de passe).
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        code = request.data.get('code')
        
        totp = pyotp.TOTP(user.two_factor_secret)
        if totp.verify(code):
            user.two_factor_enabled = False
            user.two_factor_secret = None
            user.save()
            return Response({'message': '2FA désactivé.'})
        return Response({'error': 'Code invalide.'}, status=status.HTTP_400_BAD_REQUEST)
