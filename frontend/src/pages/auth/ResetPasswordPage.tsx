// ─────────────────────────────────────────────
//  pages/auth/ResetPasswordPage.tsx
// ─────────────────────────────────────────────
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import authService from '../../services/authService';
import CameroonFlag from '../../components/common/CameroonFlag';
import { Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showPwdConfirm, setShowPwdConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (password !== passwordConfirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (!uid || !token) {
      setError('Lien de réinitialisation invalide.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(uid, token, password);
      setSuccess(true);
      toast.success('Mot de passe réinitialisé.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || 'Le lien est expiré ou invalide.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-cm-cream items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-4xl shadow-[0_24px_80px_rgba(13,31,23,0.08)] p-8 sm:p-10 animate-fadeUp">
        
        <div className="flex items-center gap-3 mb-8">
          <CameroonFlag size={24} />
          <div className="font-display font-bold text-lg text-cm-text">e-Visa Cameroun</div>
        </div>

        {success ? (
          <div className="text-center animate-fadeIn py-4">
            <div className="w-16 h-16 bg-cm-green/10 rounded-full flex items-center justify-center mx-auto mb-6 text-cm-green border border-cm-green-pale/30">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="font-display text-2xl font-bold text-cm-text mb-4">Mot de passe modifié</h2>
            <p className="text-cm-muted text-sm leading-relaxed mb-8">
              Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
            </p>
            <Link to="/auth/login" className="px-6 py-3 rounded-xl bg-cm-green text-white font-bold text-sm hover:bg-cm-green-mid transition-colors inline-block w-full">
              Continuer vers la connexion
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-display text-3xl font-bold text-cm-text mb-2">Nouveau mot de passe</h1>
            <p className="text-cm-muted text-sm mb-8">Créez un nouveau mot de passe sécurisé pour votre compte.</p>

            {error && (
              <div className="bg-cm-red/5 border border-cm-red/10 text-cm-error text-sm px-4 py-3 rounded-xl mb-6 flex items-start gap-2 animate-fadeIn">
                <span className="shrink-0 mt-0.5">⚠️</span>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-cm-text mb-2">Nouveau mot de passe</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    className="w-full pl-4 pr-12 py-3.5 bg-cm-cream/30 border border-cm-border rounded-xl text-cm-text font-medium text-sm transition-all focus:border-cm-green-mid focus:ring-4 focus:ring-cm-green/5 outline-none"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-cm-muted hover:text-cm-text">
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-cm-text mb-2">Confirmer le mot de passe</label>
                <div className="relative">
                  <input
                    type={showPwdConfirm ? 'text' : 'password'}
                    value={passwordConfirm}
                    onChange={e => { setPasswordConfirm(e.target.value); setError(''); }}
                    className="w-full pl-4 pr-12 py-3.5 bg-cm-cream/30 border border-cm-border rounded-xl text-cm-text font-medium text-sm transition-all focus:border-cm-green-mid focus:ring-4 focus:ring-cm-green/5 outline-none"
                  />
                  <button type="button" onClick={() => setShowPwdConfirm(!showPwdConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-cm-muted hover:text-cm-text">
                    {showPwdConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-linear-to-r from-cm-green to-cm-green-mid text-white font-bold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Réinitialiser le mot de passe'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
