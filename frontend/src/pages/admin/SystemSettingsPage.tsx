// ─────────────────────────────────────────────
//  pages/admin/SystemSettingsPage.tsx
// ─────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { 
  Settings, Server, Mail, Shield, 
  CreditCard, Globe, Save, Loader2 
} from 'lucide-react';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';

export default function SystemSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'EMAIL' | 'PAYMENT' | 'SECURITY'>('GENERAL');

  const [formData, setFormData] = useState({
    siteName: 'Portail E-Visa Cameroun',
    supportEmail: 'support@evisa.cm',
    maintenanceMode: false,
    
    smtpHost: 'smtp.office365.com',
    smtpPort: '587',
    smtpUser: 'no-reply@evisa.cm',
    
    mtnApiUser: '****************',
    orangeApiUser: '****************',
    stripeKey: 'pk_live_****************',
    
    sessionTimeout: '30',
    maxLoginAttempts: '5',
    require2FA: true
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const settingsList = await adminService.getSystemSettings();
      if (settingsList && settingsList.length > 0) {
        // Convert [{key: '...', value: '...'}, ...] to { key: value, ... }
        const settingsDict = settingsList.reduce((acc: any, item: any) => {
          // Parse booleans correctement (insensible à la casse: 'True', 'true', 'False', 'false')
          const lowerVal = String(item.value).toLowerCase();
          if (lowerVal === 'true') acc[item.key] = true;
          else if (lowerVal === 'false') acc[item.key] = false;
          else acc[item.key] = item.value;
          return acc;
        }, {});
        
        setFormData(prev => ({
          ...prev,
          ...settingsDict
        }));
      }
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du chargement des paramètres.');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminService.updateSystemSettings(formData);
      toast.success('Paramètres sauvegardés avec succès.');
    } catch (error) {
       console.error(error);
       toast.error('Erreur lors de la sauvegarde.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-cm-green-mid" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto pb-12">
      
      {/* ── HEADER ── */}
      <div>
        <h1 className="font-display text-3xl font-bold text-cm-text flex items-center gap-3">
          <Settings className="text-gray-500" size={32} /> Paramètres Système
        </h1>
        <p className="text-cm-muted mt-1">Configurez les services tiers, la sécurité et le comportement global de l'application.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        
        {/* ── TABS ── */}
        <div className="space-y-2">
          {[
            { id: 'GENERAL', label: 'Général', icon: <Server size={18} /> },
            { id: 'EMAIL', label: 'Serveur Email (SMTP)', icon: <Mail size={18} /> },
            { id: 'PAYMENT', label: 'Passerelles de Paiement', icon: <CreditCard size={18} /> },
            { id: 'SECURITY', label: 'Sécurité & Accès', icon: <Shield size={18} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                activeTab === tab.id 
                  ? 'bg-cm-green-pale/10 text-cm-green-mid border-l-4 border-cm-green-mid' 
                  : 'text-cm-muted hover:bg-cm-cream'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── CONTENT AREA ── */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-cm-border p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* GENERAL SETTINGS */}
              {activeTab === 'GENERAL' && (
                <div className="space-y-6 animate-fadeIn">
                  <h2 className="font-display text-xl font-bold text-cm-text flex items-center gap-2 mb-6 border-b border-cm-border pb-4">
                    <Globe size={20} className="text-cm-green-mid" /> Configurations Globales
                  </h2>
                  <div className="grid gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-cm-text mb-2">Nom de l'application</label>
                      <input 
                        type="text" 
                        value={formData.siteName}
                        onChange={e => setFormData({...formData, siteName: e.target.value})}
                        className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-cm-text mb-2">Email du support technique</label>
                      <input 
                        type="email" 
                        value={formData.supportEmail}
                        onChange={e => setFormData({...formData, supportEmail: e.target.value})}
                        className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none" 
                      />
                    </div>
                    <div className="pt-4 border-t border-cm-border/50">
                      <label className="flex items-center gap-3 cursor-pointer p-4 bg-orange-50 border border-orange-200 rounded-xl">
                        <input 
                          type="checkbox" 
                          checked={formData.maintenanceMode}
                          onChange={e => setFormData({...formData, maintenanceMode: e.target.checked})}
                          className="w-5 h-5 text-orange-500 focus:ring-orange-500 rounded" 
                        />
                        <div>
                          <span className="font-bold text-orange-800 block">Mode Maintenance</span>
                          <span className="text-xs text-orange-600">Désactiver l'accès public au site. Seuls les Administrateurs pourront se connecter.</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* SECURITY SETTINGS */}
              {activeTab === 'SECURITY' && (
                <div className="space-y-6 animate-fadeIn">
                  <h2 className="font-display text-xl font-bold text-cm-text flex items-center gap-2 mb-6 border-b border-cm-border pb-4">
                    <Shield size={20} className="text-cm-green-mid" /> Sécurité du Système
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-cm-text mb-2">Délai d'inactivité (Minutes)</label>
                      <input 
                        type="number" 
                        value={formData.sessionTimeout}
                        onChange={e => setFormData({...formData, sessionTimeout: e.target.value})}
                        className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-cm-text mb-2">Tentatives de connexion max</label>
                      <input 
                        type="number" 
                        value={formData.maxLoginAttempts}
                        onChange={e => setFormData({...formData, maxLoginAttempts: e.target.value})}
                        className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none" 
                      />
                    </div>
                    <div className="sm:col-span-2 pt-4 border-t border-cm-border/50">
                      <label className="flex items-center gap-3 cursor-pointer p-4 bg-cm-cream border border-cm-border rounded-xl hover:bg-cm-border/30 transition-colors">
                        <input 
                          type="checkbox" 
                          checked={formData.require2FA}
                          onChange={e => setFormData({...formData, require2FA: e.target.checked})}
                          className="w-5 h-5 text-cm-green-mid focus:ring-cm-green rounded" 
                        />
                        <div>
                          <span className="font-bold text-cm-text block">Forcer la double authentification (2FA)</span>
                          <span className="text-xs text-cm-muted">Exiger un code OTP pour tous les Agents de l'État (Admin, Agent, Ambassade, Frontière).</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* PAYMENT SETTINGS */}
              {activeTab === 'PAYMENT' && (
                <div className="space-y-6 animate-fadeIn">
                  <h2 className="font-display text-xl font-bold text-cm-text flex items-center gap-2 mb-6 border-b border-cm-border pb-4">
                    <CreditCard size={20} className="text-cm-green-mid" /> Intégrations Paiement
                  </h2>
                  <div className="space-y-6">
                    <div className="p-4 border border-cm-border rounded-xl bg-cm-cream/30">
                       <h3 className="font-bold text-sm text-cm-text mb-3">MTN Mobile Money API</h3>
                       <input 
                          type="password" 
                          value={formData.mtnApiUser}
                          onChange={e => setFormData({...formData, mtnApiUser: e.target.value})}
                          className="w-full px-4 py-2 bg-white border border-cm-border rounded-lg text-cm-text text-sm focus:border-cm-green-mid outline-none font-mono" 
                        />
                    </div>
                    <div className="p-4 border border-cm-border rounded-xl bg-cm-cream/30">
                       <h3 className="font-bold text-sm text-cm-text mb-3">Orange Money API</h3>
                       <input 
                          type="password" 
                          value={formData.orangeApiUser}
                          onChange={e => setFormData({...formData, orangeApiUser: e.target.value})}
                          className="w-full px-4 py-2 bg-white border border-cm-border rounded-lg text-cm-text text-sm focus:border-cm-green-mid outline-none font-mono" 
                        />
                    </div>
                    <div className="p-4 border border-cm-border rounded-xl bg-cm-cream/30">
                       <h3 className="font-bold text-sm text-cm-text mb-3">Stripe (Cartes Bancaires) - Clé Publique</h3>
                       <input 
                          type="text" 
                          value={formData.stripeKey}
                          onChange={e => setFormData({...formData, stripeKey: e.target.value})}
                          className="w-full px-4 py-2 bg-white border border-cm-border rounded-lg text-cm-text text-sm focus:border-cm-green-mid outline-none font-mono" 
                        />
                    </div>
                  </div>
                </div>
              )}

              {/* EMAIL SETTINGS */}
              {activeTab === 'EMAIL' && (
                <div className="space-y-6 animate-fadeIn">
                  <h2 className="font-display text-xl font-bold text-cm-text flex items-center gap-2 mb-6 border-b border-cm-border pb-4">
                    <Mail size={20} className="text-cm-green-mid" /> Serveur SMTP
                  </h2>
                  <p className="text-sm text-cm-muted mb-4">Configuration pour l'envoi des e-Visas et des emails transactionnels.</p>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="sm:col-span-2">
                       <label className="block text-sm font-semibold text-cm-text mb-2">Hôte SMTP</label>
                       <input 
                          type="text" 
                          value={formData.smtpHost}
                          onChange={e => setFormData({...formData, smtpHost: e.target.value})}
                          className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none" 
                        />
                    </div>
                    <div>
                       <label className="block text-sm font-semibold text-cm-text mb-2">Port SMTP</label>
                       <input 
                          type="text" 
                          value={formData.smtpPort}
                          onChange={e => setFormData({...formData, smtpPort: e.target.value})}
                          className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none" 
                        />
                    </div>
                    <div>
                       <label className="block text-sm font-semibold text-cm-text mb-2">Utilisateur (Email)</label>
                       <input 
                          type="text" 
                          value={formData.smtpUser}
                          onChange={e => setFormData({...formData, smtpUser: e.target.value})}
                          className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none" 
                        />
                    </div>
                  </div>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <div className="pt-6 border-t border-cm-border flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-cm-green to-cm-green-mid text-white rounded-xl font-bold min-w-[200px] justify-center hover:shadow-lg transition-all disabled:opacity-70"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Sauvegarder les modifications</>}
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
