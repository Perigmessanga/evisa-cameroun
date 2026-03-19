// ─────────────────────────────────────────────
//  pages/applicant/PaymentPage.tsx
// ─────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle2, ShieldCheck, ArrowRight, Loader2, FilePlus2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaymentPage() {
  const navigate = useNavigate();
  const [method, setMethod] = useState<'CARD' | 'MTN' | 'ORANGE'>('CARD');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [applicationData, setApplicationData] = useState({
    id: 'VA-2024-9982',
    type: 'Visa Tourisme (Court Séjour)',
    price: '100 000 XAF'
  });

  useEffect(() => {
    const apps = JSON.parse(localStorage.getItem('evisa_applications') || '[]');
    const lastApp = apps[apps.length - 1];
    if (lastApp) {
      setApplicationData({
        id: lastApp.id,
        type: lastApp.type,
        price: lastApp.price || '100 000 XAF'
      });
    }
  }, []);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      toast.success('Paiement réussi !');
      
      // Auto redirect after success display
      setTimeout(() => {
        navigate('/applicant/dashboard');
      }, 4000);
    }, 2500);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-12 animate-fadeIn text-center">
        <div className="bg-white rounded-4xl shadow-[0_24px_80px_rgba(13,31,23,0.08)] p-12 border border-cm-border relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-cm-green-pale via-cm-green-mid to-cm-green" />
          
          <div className="w-24 h-24 bg-cm-green/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-cm-green-pale/30">
            <CheckCircle2 size={48} className="text-cm-green" />
          </div>
          
          <h1 className="font-display text-3xl font-bold text-cm-text mb-4">Paiement Confirmé !</h1>
          <p className="text-cm-muted text-lg mb-8 leading-relaxed">
            Votre paiement de <strong>{applicationData.price}</strong> a été traité avec succès. Votre demande <strong>{applicationData.id}</strong> est maintenant transmise aux services consulaires pour traitement.
          </p>

          <div className="bg-cm-cream p-6 rounded-2xl mb-8 flex justify-between items-center text-left">
            <div>
              <p className="text-sm text-cm-muted mb-1">Reçu de paiement n°</p>
              <p className="font-mono font-bold text-cm-text">RC-CM-{Math.floor(Math.random() * 90000) + 10000}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-cm-muted mb-1">Date</p>
              <p className="font-bold text-cm-text">{new Date().toLocaleDateString('fr-FR')}</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/applicant/dashboard')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-cm-green to-cm-green-mid text-white rounded-xl font-bold hover:shadow-lg transition-all"
          >
            Retourner au tableau de bord <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fadeIn">
      
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-cm-text">Paiement Sécurisé</h1>
        <p className="text-cm-muted mt-1">Réglez les frais pour finaliser votre demande de visa.</p>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        
        {/* LEFT COLUMN: PAYMENT FORM */}
        <div className="md:col-span-3 space-y-6">
          
          {/* Method Selection */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-cm-border">
            <h2 className="text-lg font-bold text-cm-text mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-cm-green-mid" /> Moyen de paiement
            </h2>
            
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'CARD', label: 'Carte Bancaire', color: 'border-cm-green-mid bg-cm-green-pale/10' },
                { id: 'MTN', label: 'MTN Mobile Money', color: 'border-yellow-500 bg-yellow-50' },
                { id: 'ORANGE', label: 'Orange Money', color: 'border-orange-500 bg-orange-50' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMethod(opt.id as 'CARD'|'MTN'|'ORANGE')}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2
                    ${method === opt.id ? opt.color : 'border-cm-border hover:border-cm-green-pale bg-white'}
                  `}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mb-1
                    ${method === opt.id ? 'border-cm-green-mid' : 'border-cm-border'}`}
                  >
                    {method === opt.id && <div className="w-2 h-2 rounded-full bg-cm-green-mid" />}
                  </div>
                  <span className="text-sm font-bold text-cm-text text-center leading-tight">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-cm-border p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cm-gold/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            
            <form onSubmit={handlePayment} className="relative z-10 space-y-6">
              
              {method === 'CARD' && (
                <div className="space-y-5 animate-fadeIn">
                  <div>
                    <label className="block text-sm font-semibold text-cm-text mb-2">Nom sur la carte</label>
                    <input type="text" required placeholder="Ex: Jean Dupont" className="w-full px-4 py-3 bg-cm-cream/30 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-cm-text mb-2">Numéro de carte</label>
                    <div className="relative">
                      <input type="text" required placeholder="0000 0000 0000 0000" maxLength={19} className="w-full pl-12 pr-4 py-3 bg-cm-cream/30 border border-cm-border rounded-xl text-cm-text text-sm font-mono focus:border-cm-green-mid outline-none" />
                      <CreditCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cm-muted" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-cm-text mb-2">Expiration (MM/AA)</label>
                      <input type="text" required placeholder="MM/AA" maxLength={5} className="w-full px-4 py-3 bg-cm-cream/30 border border-cm-border rounded-xl text-cm-text text-sm text-center focus:border-cm-green-mid outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-cm-text mb-2">CVC</label>
                      <input type="password" required placeholder="123" maxLength={3} className="w-full px-4 py-3 bg-cm-cream/30 border border-cm-border rounded-xl text-cm-text text-sm text-center focus:border-cm-green-mid outline-none" />
                    </div>
                  </div>
                </div>
              )}

              {(method === 'MTN' || method === 'ORANGE') && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-800 text-sm mb-6 flex items-start gap-3">
                    <span className="mt-0.5">ℹ️</span>
                    <div>Entrez votre numéro de téléphone. Un prompt de validation s'affichera sur votre écran mobile pour confirmer la transaction.</div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-cm-text mb-2">Numéro de téléphone ({method})</label>
                    <div className="flex">
                      <div className="px-4 py-3 bg-cm-cream border border-cm-border border-r-0 rounded-l-xl text-cm-muted font-bold text-sm">
                        +237
                      </div>
                      <input type="tel" required placeholder="6XX XXX XXX" className="w-full px-4 py-3 bg-cm-cream/30 border border-cm-border rounded-r-xl text-cm-text text-sm font-mono focus:border-cm-green-mid outline-none" />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-linear-to-r from-cm-green to-cm-green-mid text-white font-bold text-base transition-all hover:shadow-[0_8px_24px_rgba(27,67,50,0.2)] hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  {loading ? (
                    <><Loader2 size={20} className="animate-spin" /> Traitement en cours...</>
                  ) : (
                    <>Payer {applicationData.price} <ArrowRight size={20} /></>
                  )}
                </button>
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-cm-muted/80 font-semibold">
                  <ShieldCheck size={14} /> Paiement 100% sécurisé et chiffré
                </div>
              </div>

            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: RECAP */}
        <div className="md:col-span-2">
          <div className="bg-cm-cream border border-cm-border rounded-2xl p-6 sticky top-24">
            <h3 className="font-display text-xl font-bold text-cm-text mb-6">Récapitulatif</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-start border-b border-cm-border/50 pb-4">
                <div>
                  <div className="text-xs font-bold text-cm-muted mb-1">N° DEMANDE</div>
                  <div className="font-bold text-cm-text">{applicationData.id}</div>
                </div>
              </div>
              
              <div className="flex justify-between items-start border-b border-cm-border/50 pb-4">
                <div>
                  <div className="text-xs font-bold text-cm-muted mb-1">TYPE DE VISA</div>
                  <div className="font-bold text-cm-text">{applicationData.type}</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-cm-border space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-cm-muted">Frais consulaires</span>
                <span className="font-bold text-cm-text">{applicationData.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-cm-muted">Frais de service (0%)</span>
                <span className="font-bold text-cm-text">0 XAF</span>
              </div>
              <div className="pt-3 border-t border-cm-border flex justify-between text-lg">
                <span className="font-bold text-cm-text">Total à payer</span>
                <span className="font-display font-bold text-cm-green-mid">{applicationData.price}</span>
              </div>
            </div>

            <div className="mt-8 flex items-start gap-3 p-4 bg-white/50 rounded-xl">
              <FilePlus2 className="text-cm-gold shrink-0" size={20} />
              <p className="text-xs text-cm-muted leading-relaxed">
                Le traitement de votre demande débutera immédiatement après la confirmation du paiement par nos services financiers.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
