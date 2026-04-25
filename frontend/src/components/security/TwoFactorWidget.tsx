import { useState } from 'react';
import { ShieldCheck, ShieldAlert, Key, Loader2, QrCode, CheckCircle, X } from 'lucide-react';
import authService from '../../services/authService';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

export default function TwoFactorWidget() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [setupData, setSetupData] = useState<{ secret: string; qr_code: string } | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'INITIAL' | 'QR' | 'VERIFY'>('INITIAL');

  const handleStartSetup = async () => {
    try {
      setLoading(true);
      const data = await authService.setup2FA();
      setSetupData(data);
      setStep('QR');
      setShowSetup(true);
    } catch (error) {
      toast.error('Impossible de générer le code 2FA.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length < 6) {
      toast.error('Veuillez entrer un code valide à 6 chiffres.');
      return;
    }

    try {
      setLoading(true);
      await authService.verify2FA(verificationCode);
      toast.success('Double authentification activée avec succès !');
      await refreshUser();
      setShowSetup(false);
      setStep('INITIAL');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Code invalide.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    const code = window.prompt('Entrez votre code 2FA actuel pour désactiver :');
    if (!code) return;

    try {
      setLoading(true);
      await authService.disable2FA(code);
      toast.success('Double authentification désactivée.');
      await refreshUser();
    } catch (error) {
      toast.error('Échec de la désactivation. Code incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-cm-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${user?.two_factor_enabled ? 'bg-cm-green/10 text-cm-green' : 'bg-cm-red/10 text-cm-red'}`}>
            {user?.two_factor_enabled ? <ShieldCheck size={28} /> : <ShieldAlert size={28} />}
          </div>
          <div>
            <h3 className="font-bold text-cm-text text-lg">Sécurisation du Compte (2FA)</h3>
            <p className="text-sm text-cm-muted">Ajoutez une couche de sécurité "State-Grade" via TOTP.</p>
          </div>
        </div>
        {!user?.two_factor_enabled ? (
          <button
            onClick={handleStartSetup}
            disabled={loading}
            className="px-4 py-2 bg-cm-green text-white rounded-xl font-bold text-sm hover:bg-cm-green-mid transition-colors flex items-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Key size={16} />}
            Activer 2FA
          </button>
        ) : (
          <button
            onClick={handleDisable}
            disabled={loading}
            className="px-4 py-2 bg-cm-cream text-cm-red border border-cm-red/20 rounded-xl font-bold text-sm hover:bg-cm-red/5 transition-colors"
          >
            Désactiver
          </button>
        )}
      </div>

      {showSetup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-scaleIn relative">
            <button 
              onClick={() => setShowSetup(false)}
              className="absolute top-6 right-6 p-2 hover:bg-cm-cream rounded-full transition-colors"
            >
              <X size={20} className="text-cm-muted" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-cm-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="text-cm-green" size={32} />
              </div>
              <h2 className="text-2xl font-display font-bold text-cm-text">Configuration 2FA</h2>
              <p className="text-sm text-cm-muted mt-1">Sécurisez vos accès étatiques.</p>
            </div>

            {step === 'QR' && (
              <div className="space-y-6">
                <div className="flex justify-center p-4 bg-cm-cream rounded-2xl border border-cm-border shadow-inner">
                  {setupData && (
                    <img src={setupData.qr_code} alt="QR 2FA" className="w-48 h-48 mix-blend-multiply" />
                  )}
                </div>
                <div className="bg-cm-gold/5 p-4 rounded-xl border border-cm-gold/20">
                  <p className="text-xs leading-relaxed text-cm-text font-medium text-center">
                    Scannez ce code avec <span className="text-cm-green font-bold">Google Authenticator</span> ou <span className="text-cm-green font-bold">Authy</span>.
                  </p>
                </div>
                <button
                  onClick={() => setStep('VERIFY')}
                  className="w-full py-4 bg-cm-green text-white rounded-2xl font-bold hover:bg-cm-green-mid transition-all shadow-lg hover:shadow-cm-green/20"
                >
                  Continuer la vérification
                </button>
              </div>
            )}

            {step === 'VERIFY' && (
              <div className="space-y-6">
                <div className="text-center">
                  <label className="block text-sm font-bold text-cm-muted mb-4">Entrez le code à 6 chiffres généré par votre app :</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-4xl font-display font-bold tracking-[0.5em] py-4 bg-cm-cream border-2 border-cm-border rounded-2xl focus:border-cm-green outline-none transition-all"
                    placeholder="000000"
                    autoFocus
                  />
                </div>
                <button
                  onClick={handleVerify}
                  disabled={loading || verificationCode.length < 6}
                  className="w-full py-4 bg-cm-green text-white rounded-2xl font-bold hover:bg-cm-green-mid transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Finaliser l\'Activation'}
                </button>
                <button 
                  onClick={() => setStep('QR')}
                  className="w-full py-2 text-sm font-bold text-cm-muted hover:text-cm-text transition-colors"
                >
                  Retour au QR Code
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {user?.two_factor_enabled && !showSetup && (
        <div className="flex items-center gap-2 p-3 bg-cm-green/5 rounded-xl border border-cm-green/20">
          <CheckCircle className="text-cm-green" size={16} />
          <span className="text-xs font-bold text-cm-green">Votre compte est protégé par une signature biométrique/jeton.</span>
        </div>
      )}
    </div>
  );
}
