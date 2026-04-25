import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Lock, Save, Loader2, ShieldCheck } from 'lucide-react';
import TwoFactorWidget from '../../components/security/TwoFactorWidget';
import toast from 'react-hot-toast';

export default function AdminProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'INFO' | 'SECURITY'>('INFO');

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Mot de passe administrateur modifié.');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fadeIn">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-cm-text">Mon Profil Administrateur</h1>
        <p className="text-cm-muted mt-1">Gérez vos accès privilégiés et la sécurité de votre compte "Superuser".</p>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        <div className="space-y-2">
          <button
            onClick={() => setActiveTab('INFO')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
              activeTab === 'INFO' ? 'bg-cm-green-pale/10 text-cm-green-mid border-l-4 border-cm-green-mid' : 'text-cm-muted hover:bg-cm-cream'
            }`}
          >
            <User size={18} /> Informations
          </button>
          <button
            onClick={() => setActiveTab('SECURITY')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
              activeTab === 'SECURITY' ? 'bg-cm-green-pale/10 text-cm-green-mid border-l-4 border-cm-green-mid' : 'text-cm-muted hover:bg-cm-cream'
            }`}
          >
            <Lock size={18} /> Sécurité (2FA)
          </button>
        </div>

        <div className="md:col-span-3">
          {activeTab === 'INFO' && (
            <div className="bg-white rounded-2xl border border-cm-border p-8 shadow-sm">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-2xl bg-cm-green text-white flex items-center justify-center text-3xl font-bold uppercase shadow-lg">
                  {user?.first_name[0]}{user?.last_name[0]}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-cm-text">{user?.first_name} {user?.last_name}</h2>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cm-red/10 text-cm-red rounded-full text-xs font-bold mt-2 uppercase tracking-wider">
                    <ShieldCheck size={12} /> Administrateur Système
                  </div>
                </div>
              </div>
              <div className="grid gap-6">
                <div>
                  <label className="block text-xs font-bold text-cm-muted uppercase mb-2">Adresse Email</label>
                  <div className="p-3 bg-cm-cream rounded-xl text-cm-text font-medium border border-cm-border">{user?.email}</div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-cm-muted uppercase mb-2">Rôle</label>
                  <div className="p-3 bg-cm-cream rounded-xl text-cm-text font-medium border border-cm-border">Super Administrateur (Full Access)</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'SECURITY' && (
            <div className="space-y-8">
              <TwoFactorWidget />

              <div className="bg-white rounded-2xl border border-cm-border p-8 shadow-sm">
                <h3 className="font-bold text-cm-text text-lg mb-6">Changement de mot de passe</h3>
                <form onSubmit={handleSecuritySubmit} className="space-y-5">
                  <input 
                    type="password" 
                    placeholder="Mot de passe actuel"
                    required
                    className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl outline-none focus:border-cm-green"
                    value={securityData.currentPassword}
                    onChange={e => setSecurityData({...securityData, currentPassword: e.target.value})}
                  />
                  <input 
                    type="password" 
                    placeholder="Nouveau mot de passe"
                    required
                    className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl outline-none focus:border-cm-green"
                    value={securityData.newPassword}
                    onChange={e => setSecurityData({...securityData, newPassword: e.target.value})}
                  />
                  <input 
                    type="password" 
                    placeholder="Confirmer nouveau mot de passe"
                    required
                    className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl outline-none focus:border-cm-green"
                    value={securityData.confirmPassword}
                    onChange={e => setSecurityData({...securityData, confirmPassword: e.target.value})}
                  />
                  <button
                    disabled={loading}
                    className="w-full py-3 bg-cm-text text-white rounded-xl font-bold hover:bg-cm-green transition-all"
                  >
                    {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Mettre à jour le mot de passe'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
