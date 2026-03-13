// ─────────────────────────────────────────────
//  pages/auth/VerifyEmailPage.tsx
// ─────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import authService from '../../services/authService';
import CameroonFlag from '../../components/common/CameroonFlag';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VerifyEmailPage() {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const navigate = useNavigate();
  const called = useRef(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    if (!uid || !token) {
      setError('Lien de vérification invalide ou expiré.');
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        await authService.verifyEmail(uid, token);
        setSuccess(true);
        toast.success('Email vérifié avec succès.');
        setTimeout(() => navigate('/auth/login'), 3000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        const msg = err.response?.data?.detail || err.response?.data?.message || 'Le lien de vérification est expiré ou invalide.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [uid, token, navigate]);

  return (
    <div className="min-h-screen flex bg-cm-cream items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-4xl shadow-[0_24px_80px_rgba(13,31,23,0.08)] p-8 sm:p-10 animate-fadeUp text-center">
        
        <div className="flex justify-center mb-6">
          <CameroonFlag size={48} />
        </div>
        <h1 className="font-display text-2xl font-bold text-cm-text mb-8">Vérification de l'email</h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 size={40} className="text-cm-gold animate-spin mb-4" />
            <p className="text-cm-muted font-medium">Vérification en cours, veuillez patienter...</p>
          </div>
        ) : success ? (
          <div className="animate-fadeIn py-4">
            <div className="w-20 h-20 bg-cm-green/10 rounded-full flex items-center justify-center mx-auto mb-6 text-cm-green border border-cm-green-pale/30">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="font-display text-xl font-bold text-cm-text mb-4">Compte activé !</h2>
            <p className="text-cm-muted text-sm leading-relaxed mb-8">
              Votre adresse email a été vérifiée avec succès. Vous allez être redirigé vers la page de connexion.
            </p>
            <Link to="/auth/login" className="px-6 py-3 rounded-xl bg-cm-green text-white font-bold text-sm hover:bg-cm-green-mid transition-colors inline-block w-full">
              Se connecter maintenant
            </Link>
          </div>
        ) : (
          <div className="animate-fadeIn py-4">
            <div className="w-20 h-20 bg-cm-red/10 rounded-full flex items-center justify-center mx-auto mb-6 text-cm-red border border-cm-red/20">
              <XCircle size={40} />
            </div>
            <h2 className="font-display text-xl font-bold text-cm-text mb-4">Échec de vérification</h2>
            <p className="text-cm-muted text-sm leading-relaxed mb-8">
              {error}
            </p>
            <Link to="/auth/login" className="px-6 py-3 rounded-xl bg-cm-cream text-cm-text font-bold text-sm hover:bg-cm-cream/80 border border-cm-border transition-colors inline-block w-full">
              Retour à la connexion
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
