// ─────────────────────────────────────────────
//  pages/auth/LoginPage.tsx
// ─────────────────────────────────────────────
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CameroonFlag from '../../components/common/CameroonFlag';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/applicant/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'LOGIN' | '2FA'>('LOGIN');
  const [otpCode, setOtpCode] = useState('');
  
  // Custom Validation (not touching library if valid simple check works)
  const validateEmail = (e: string) => /\S+@\S+\.\S+/.test(e);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 'LOGIN') {
      if (!email.trim() || !validateEmail(email)) {
        setError('Veuillez entrer une adresse email valide.');
        return;
      }
      if (!password) {
        setError('Le mot de passe est requis.');
        return;
      }
    } else {
      if (!otpCode || otpCode.length < 6) {
        setError('Veuillez entrer votre code de sécurité à 6 chiffres.');
        return;
      }
    }

    setLoading(true);
    try {
      await login(email, password, otpCode);
      toast.success('Connexion réussie');
      navigate(from, { replace: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response?.status === 403 && err.response?.data?.message === '2FA_REQUIRED') {
         setStep('2FA');
         toast.success('Veuillez entrer votre code de sécurité 2FA.');
      } else {
         const msg =
           err.response?.data?.message ||
           err.response?.data?.errors?.non_field_errors?.[0] ||
           (err.message === 'No response from server' ? 'Serveur indisponible.' : 'Email ou mot de passe incorrect.');
         setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-cm-cream">
      {/* ── LEFT PANEL (Decoration) ── */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center p-12 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-linear-to-br from-cm-dark via-cm-green to-cm-green-mid" />
        <div className="absolute inset-0 geo-pattern opacity-10 blur-[1px]" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-cm-gold/20 rounded-full blur-[100px] animate-pulse-ring" />
        
        <div className="relative z-10 max-w-md text-center">
          <div className="flex justify-center mb-8">
            <CameroonFlag size={48} />
          </div>
          <h2 className="font-display text-4xl font-bold text-white mb-6 leading-tight">
            Plateforme officielle<br />
            <span className="text-cm-gold-light">e-Visa Cameroun</span>
          </h2>
          <p className="text-white/70 text-lg font-light leading-relaxed mb-12">
            Accédez à votre espace personnel pour suivre vos demandes de visa et télécharger vos documents.
          </p>
          
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-cm-gold/20 p-6 text-left shadow-2xl">
            <div className="text-cm-gold text-[0.65rem] font-bold tracking-[0.15em] mb-3">SÉCURITÉ</div>
            <p className="text-white/60 text-sm leading-relaxed">
              Cette plateforme utilise le chiffrement SSL/TLS et l'authentification sécurisée JWT pour protéger vos données personnelles et consulaires.
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (Auth Form) ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 w-full lg:w-auto">
        <div className="w-full max-w-md bg-white rounded-4xl shadow-[0_24px_80px_rgba(13,31,23,0.08)] p-8 sm:p-10 animate-fadeUp">
          
          <div className="flex items-center gap-3 mb-10">
            <CameroonFlag size={24} />
            <div>
              <div className="font-display font-bold text-lg text-cm-text">e-Visa Cameroun</div>
              <div className="text-cm-gold text-[0.55rem] tracking-[0.15em] font-bold leading-none">CONNEXION SÉCURISÉE</div>
            </div>
          </div>

          <h1 className="font-display text-3xl font-bold text-cm-text mb-2">
            {step === 'LOGIN' ? 'Bienvenue' : 'Sécurité 2FA'}
          </h1>
          <p className="text-cm-muted text-sm mb-8">
            {step === 'LOGIN' ? 'Connectez-vous à votre espace personnel.' : 'Votre compte est protégé. Veuillez entrer le code de votre application.'}
          </p>

          {error && (
            <div className="bg-cm-red/5 border border-cm-red/10 text-cm-error text-sm px-4 py-3 rounded-xl mb-6 flex items-start gap-2 animate-fadeIn">
              <span className="shrink-0 mt-0.5"></span>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} noValidate className="space-y-5">
            {step === 'LOGIN' ? (
              <>
                <div>
                  <label className="block text-sm font-semibold text-cm-text mb-2">Adresse email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder="votre@email.com"
                    autoComplete="email"
                    className="w-full px-4 py-3.5 bg-cm-cream/30 border border-cm-border rounded-xl text-cm-text font-medium text-sm transition-all focus:border-cm-green-mid focus:ring-4 focus:ring-cm-green/5 outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-cm-text">Mot de passe</label>
                    <Link to="/auth/forgot-password" className="text-sm font-semibold text-cm-green-mid hover:text-cm-green transition-colors">
                      Mot de passe oublié ?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError(''); }}
                      placeholder="Votre mot de passe"
                      autoComplete="current-password"
                      className="w-full pl-4 pr-12 py-3.5 bg-cm-cream/30 border border-cm-border rounded-xl text-cm-text font-medium text-sm transition-all focus:border-cm-green-mid focus:ring-4 focus:ring-cm-green/5 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-cm-muted hover:text-cm-text transition-colors"
                    >
                      {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-bold text-center text-cm-muted mb-4">Code de sécurité à 6 chiffres</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={e => { setOtpCode(e.target.value.replace(/\D/g, '')); setError(''); }}
                  placeholder="000000"
                  autoFocus
                  className="w-full text-center text-4xl font-display font-bold tracking-[0.5em] py-4 bg-cm-cream border-2 border-cm-border rounded-2xl focus:border-cm-green outline-none transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setStep('LOGIN')}
                  className="w-full text-center mt-4 text-xs font-bold text-cm-muted hover:text-cm-text uppercase tracking-widest transition-colors"
                >
                  Retour à la connexion classique
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-linear-to-r from-cm-green to-cm-green-mid text-white font-bold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : (step === 'LOGIN' ? 'Se connecter' : 'Vérifier & Se connecter')}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-cm-muted">
            Pas encore de compte ?{' '}
            <Link to="/auth/register" className="font-bold text-cm-green-mid hover:text-cm-green transition-colors">
              S'inscrire
            </Link>
          </p>

          <p className="text-center mt-8 text-[0.65rem] text-cm-muted/60 leading-relaxed max-w-xs mx-auto">
            Ce site est protégé par reCAPTCHA et la politique de confidentialité s'applique.
          </p>
        </div>
      </div>
    </div>
  );
}
