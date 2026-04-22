// ─────────────────────────────────────────────
//  pages/applicant/ProfilePage.tsx
// ─────────────────────────────────────────────
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';
import { User, Mail, Lock, CheckCircle2, Loader2, Save, Globe, Phone, AlertCircle, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { parsePhoneNumber, isValidPhoneNumber, type CountryCode } from 'libphonenumber-js';
import { COUNTRIES } from './ApplicationFormPage';

// ─── Préfixes téléphoniques ───────────────────
const PHONE_PREFIXES = [
  { code: 'CM', prefix: '+237', flag: '🇨🇲', label: 'Cameroun' },
  { code: 'FR', prefix: '+33',  flag: '🇫🇷', label: 'France' },
  { code: 'US', prefix: '+1',   flag: '🇺🇸', label: 'États-Unis / Canada' },
  { code: 'GB', prefix: '+44',  flag: '🇬🇧', label: 'Royaume-Uni' },
  { code: 'DE', prefix: '+49',  flag: '🇩🇪', label: 'Allemagne' },
  { code: 'BE', prefix: '+32',  flag: '🇧🇪', label: 'Belgique' },
  { code: 'CH', prefix: '+41',  flag: '🇨🇭', label: 'Suisse' },
  { code: 'IT', prefix: '+39',  flag: '🇮🇹', label: 'Italie' },
  { code: 'ES', prefix: '+34',  flag: '🇪🇸', label: 'Espagne' },
  { code: 'PT', prefix: '+351', flag: '🇵🇹', label: 'Portugal' },
  { code: 'SN', prefix: '+221', flag: '🇸🇳', label: 'Sénégal' },
  { code: 'CI', prefix: '+225', flag: '🇨🇮', label: "Côte d'Ivoire" },
  { code: 'GH', prefix: '+233', flag: '🇬🇭', label: 'Ghana' },
  { code: 'NG', prefix: '+234', flag: '🇳🇬', label: 'Nigeria' },
  { code: 'GA', prefix: '+241', flag: '🇬🇦', label: 'Gabon' },
  { code: 'CG', prefix: '+242', flag: '🇨🇬', label: 'Congo (Brazzaville)' },
  { code: 'CD', prefix: '+243', flag: '🇨🇩', label: 'Congo (RDC)' },
  { code: 'MA', prefix: '+212', flag: '🇲🇦', label: 'Maroc' },
  { code: 'DZ', prefix: '+213', flag: '🇩🇿', label: 'Algérie' },
  { code: 'TN', prefix: '+216', flag: '🇹🇳', label: 'Tunisie' },
  { code: 'EG', prefix: '+20',  flag: '🇪🇬', label: 'Égypte' },
  { code: 'ZA', prefix: '+27',  flag: '🇿🇦', label: 'Afrique du Sud' },
  { code: 'KE', prefix: '+254', flag: '🇰🇪', label: 'Kenya' },
  { code: 'ET', prefix: '+251', flag: '🇪🇹', label: 'Éthiopie' },
  { code: 'CN', prefix: '+86',  flag: '🇨🇳', label: 'Chine' },
  { code: 'IN', prefix: '+91',  flag: '🇮🇳', label: 'Inde' },
  { code: 'BR', prefix: '+55',  flag: '🇧🇷', label: 'Brésil' },
  { code: 'RU', prefix: '+7',   flag: '🇷🇺', label: 'Russie' },
  { code: 'TR', prefix: '+90',  flag: '🇹🇷', label: 'Turquie' },
  { code: 'AU', prefix: '+61',  flag: '🇦🇺', label: 'Australie' },
  { code: 'JP', prefix: '+81',  flag: '🇯🇵', label: 'Japon' },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'INFO' | 'SECURITY'>('INFO');

  // Form State
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phonePrefix: '+237',
    phoneCountryCode: 'CM' as CountryCode,
    phoneLocal: '',
    nationality: '',
    address: ''
  });

  // Erreurs inline par champ
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Validation individuelle d'un champ
  const validateField = (name: string, value: string): string => {
    if (name === 'firstName' && !value.trim()) return 'Le prénom est obligatoire.';
    if (name === 'lastName' && !value.trim()) return 'Le nom de famille est obligatoire.';
    if (name === 'phoneLocal' && value.trim()) {
      const fullPhone = `${formData.phonePrefix}${value.replace(/\s/g, '')}`;
      try {
        if (!isValidPhoneNumber(fullPhone, formData.phoneCountryCode)) {
          return `Numéro invalide pour le préfixe ${formData.phonePrefix}. Vérifiez le numéro saisi.`;
        }
      } catch {
        return 'Format de numéro de téléphone invalide.';
      }
    }
    return '';
  };

  const handleFieldChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Effacer l'erreur dès saisie
    if (fieldErrors[name]) {
      setFieldErrors(prev => { const next = { ...prev }; delete next[name]; return next; });
    }
  };

  const handleBlur = (name: string, value: string) => {
    const error = validateField(name, value);
    if (error) {
      setFieldErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handlePrefixChange = (prefixEntry: typeof PHONE_PREFIXES[0]) => {
    setFormData(prev => ({
      ...prev,
      phonePrefix: prefixEntry.prefix,
      phoneCountryCode: prefixEntry.code as CountryCode,
    }));
    // Re-valider le numéro si déjà rempli
    if (formData.phoneLocal.trim()) {
      setFieldErrors(prev => { const next = { ...prev }; delete next.phoneLocal; return next; });
    }
  };

  // Validation globale avant envoi
  const validateForm = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!formData.firstName.trim()) errors.firstName = 'Le prénom est obligatoire.';
    if (!formData.lastName.trim()) errors.lastName = 'Le nom de famille est obligatoire.';
    if (formData.phoneLocal.trim()) {
      const fullPhone = `${formData.phonePrefix}${formData.phoneLocal.replace(/\s/g, '')}`;
      try {
        if (!isValidPhoneNumber(fullPhone, formData.phoneCountryCode)) {
          errors.phoneLocal = `Numéro invalide pour le préfixe ${formData.phonePrefix}. Exemples valides : pour +237 → 677 00 00 00, pour +33 → 6 00 00 00 00.`;
        }
      } catch {
        errors.phoneLocal = 'Format de numéro de téléphone incorrect.';
      }
    }
    return errors;
  };

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    // Construire le numéro complet si renseigné
    let phoneValue = '';
    if (formData.phoneLocal.trim()) {
      try {
        const parsed = parsePhoneNumber(`${formData.phonePrefix}${formData.phoneLocal.replace(/\s/g, '')}`, formData.phoneCountryCode);
        phoneValue = parsed.format('E.164'); // format international : +2376XXXXXXXX
      } catch {
        phoneValue = `${formData.phonePrefix}${formData.phoneLocal.replace(/\s/g, '')}`;
      }
    }

    setLoading(true);
    try {
      await authService.updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: phoneValue || undefined,
        nationality: formData.nationality || undefined,
      } as any);
      toast.success('Informations du profil mises à jour avec succès.');
    } catch (err: any) {
      const errData = err.response?.data;
      // Essayer d'extraire les erreurs spécifiques
      if (errData && typeof errData === 'object') {
        const fieldTranslations: Record<string, string> = {
          phone: 'Téléphone',
          first_name: 'Prénom',
          last_name: 'Nom',
          nationality: 'Nationalité',
        };
        const messages: string[] = [];
        Object.entries(errData).forEach(([field, error]: [string, any]) => {
          const fieldName = fieldTranslations[field] || field;
          const message = Array.isArray(error) ? error[0] : error;
          messages.push(`${fieldName} : ${message}`);
        });
        if (messages.length > 0) {
          toast.error(`Erreur de mise à jour :\n${messages.join('\n')}`, { duration: 6000 });
          return;
        }
      }
      toast.error(errData?.detail || 'Erreur lors de la mise à jour du profil. Vérifiez vos informations.');
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!securityData.currentPassword) {
      toast.error('Veuillez saisir votre mot de passe actuel.');
      return;
    }
    if (securityData.newPassword.length < 8) {
      toast.error('Le nouveau mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    try {
      await authService.changePassword(
        securityData.currentPassword,
        securityData.newPassword,
        securityData.confirmPassword
      );
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Mot de passe modifié avec succès.');
    } catch (err: any) {
      const errData = err.response?.data;
      if (errData?.old_password) {
        toast.error(`Mot de passe actuel : ${errData.old_password[0]}`);
      } else if (errData?.new_password) {
        toast.error(`Nouveau mot de passe : ${errData.new_password[0]}`);
      } else {
        toast.error(errData?.detail || 'Erreur lors de la modification du mot de passe.');
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedPrefix = PHONE_PREFIXES.find(p => p.prefix === formData.phonePrefix) || PHONE_PREFIXES[0];

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fadeIn">
      
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-cm-text">Mon Profil</h1>
        <p className="text-cm-muted mt-1">Gérez vos informations personnelles et vos paramètres de sécurité.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        
        {/* ── LEFT TABS ── */}
        <div className="space-y-2">
          <button
            onClick={() => setActiveTab('INFO')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
              activeTab === 'INFO' 
                ? 'bg-cm-green-pale/10 text-cm-green-mid border-l-4 border-cm-green-mid' 
                : 'text-cm-muted hover:bg-cm-cream'
            }`}
          >
            <User size={18} /> Informations liées
          </button>
          <button
            onClick={() => setActiveTab('SECURITY')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
              activeTab === 'SECURITY' 
                ? 'bg-cm-green-pale/10 text-cm-green-mid border-l-4 border-cm-green-mid' 
                : 'text-cm-muted hover:bg-cm-cream'
            }`}
          >
            <Lock size={18} /> Sécurité & Mot de passe
          </button>
        </div>

        {/* ── CONTENT AREA ── */}
        <div className="md:col-span-3">
          
          {activeTab === 'INFO' && (
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-cm-border overflow-hidden animate-fadeIn">
              
              <div className="p-6 sm:p-8 border-b border-cm-border flex items-center gap-4 bg-cm-cream/30">
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-cm-green-pale to-cm-green text-white flex items-center justify-center font-display font-bold text-2xl shadow-inner shrink-0">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </div>
                <div>
                  <h2 className="font-bold text-lg text-cm-text">{user?.first_name} {user?.last_name}</h2>
                  <p className="text-sm font-semibold text-cm-gold flex items-center gap-1 mt-0.5"><CheckCircle2 size={14} /> Compte Demandeur vérifié</p>
                </div>
              </div>

              {/* Bannière erreurs globale */}
              {Object.keys(fieldErrors).length > 0 && (
                <div className="mx-6 mt-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-red-700 mb-1">Veuillez corriger les erreurs suivantes :</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      {Object.values(fieldErrors).map((msg, i) => (
                        <li key={i} className="text-xs text-red-600">{msg}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <form onSubmit={handleInfoSubmit} className="p-6 sm:p-8 space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">

                  {/* Prénom */}
                  <div>
                    <label className="block text-sm font-semibold text-cm-text mb-2">Prénom(s) <span className="text-cm-red">*</span></label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleFieldChange('firstName', e.target.value)}
                        onBlur={(e) => handleBlur('firstName', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 bg-cm-cream/50 border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none ${fieldErrors.firstName ? 'border-red-400 bg-red-50' : 'border-cm-border'}`}
                      />
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cm-muted" />
                    </div>
                    {fieldErrors.firstName && <InlineError message={fieldErrors.firstName} />}
                  </div>

                  {/* Nom */}
                  <div>
                    <label className="block text-sm font-semibold text-cm-text mb-2">Nom de famille <span className="text-cm-red">*</span></label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleFieldChange('lastName', e.target.value)}
                      onBlur={(e) => handleBlur('lastName', e.target.value)}
                      className={`w-full px-4 py-3 bg-cm-cream/50 border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none ${fieldErrors.lastName ? 'border-red-400 bg-red-50' : 'border-cm-border'}`}
                    />
                    {fieldErrors.lastName && <InlineError message={fieldErrors.lastName} />}
                  </div>

                  {/* Email (readonly) */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-cm-text mb-2">Adresse Email</label>
                    <div className="relative">
                      <input
                        type="email"
                        disabled
                        value={formData.email}
                        className="w-full pl-10 pr-4 py-3 bg-cm-cream border border-cm-border rounded-xl text-cm-muted font-medium text-sm outline-none cursor-not-allowed"
                      />
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cm-muted" />
                    </div>
                    <p className="text-xs text-cm-muted/70 mt-1.5 font-medium">L'adresse email ne peut pas être modifiée car elle sert d'identifiant unique.</p>
                  </div>

                  {/* Nationalité — Select */}
                  <div>
                    <label className="block text-sm font-semibold text-cm-text mb-2">
                      <Globe size={14} className="inline mr-1 text-cm-muted" />
                      Nationalité
                    </label>
                    <div className="relative">
                      <select
                        value={formData.nationality}
                        onChange={(e) => handleFieldChange('nationality', e.target.value)}
                        className="w-full pl-4 pr-10 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none appearance-none"
                      >
                        <option value="">Sélectionnez une nationalité</option>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cm-muted pointer-events-none" />
                    </div>
                  </div>

                  {/* Téléphone — Préfixe + Numéro local */}
                  <div>
                    <label className="block text-sm font-semibold text-cm-text mb-2">
                      <Phone size={14} className="inline mr-1 text-cm-muted" />
                      Téléphone
                    </label>
                    <div className="flex gap-2">
                      {/* Sélecteur de préfixe */}
                      <div className="relative shrink-0">
                        <select
                          value={formData.phonePrefix}
                          onChange={(e) => {
                            const found = PHONE_PREFIXES.find(p => p.prefix === e.target.value);
                            if (found) handlePrefixChange(found);
                          }}
                          className="h-full pl-3 pr-8 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none appearance-none font-mono font-bold"
                          style={{ minWidth: '110px' }}
                          title="Sélectionner le préfixe"
                        >
                          {PHONE_PREFIXES.map(p => (
                            <option key={p.code} value={p.prefix}>
                              {p.flag} {p.prefix}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-cm-muted pointer-events-none" />
                      </div>
                      {/* Numéro local */}
                      <input
                        type="tel"
                        placeholder={selectedPrefix.code === 'CM' ? '677 00 00 00' : selectedPrefix.code === 'FR' ? '6 00 00 00 00' : '...'}
                        value={formData.phoneLocal}
                        onChange={(e) => handleFieldChange('phoneLocal', e.target.value)}
                        onBlur={(e) => handleBlur('phoneLocal', e.target.value)}
                        className={`flex-1 px-4 py-3 bg-cm-cream/50 border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none ${fieldErrors.phoneLocal ? 'border-red-400 bg-red-50' : 'border-cm-border'}`}
                      />
                    </div>
                    {fieldErrors.phoneLocal && <InlineError message={fieldErrors.phoneLocal} />}
                    {formData.phoneLocal && !fieldErrors.phoneLocal && (
                      <p className="text-xs text-cm-green-mid mt-1 font-medium flex items-center gap-1">
                        <CheckCircle2 size={11} />
                        Numéro valide : {formData.phonePrefix} {formData.phoneLocal}
                      </p>
                    )}
                    <p className="text-xs text-cm-muted/70 mt-1">Saisissez le numéro sans le préfixe international.</p>
                  </div>

                </div>

                <div className="pt-6 border-t border-cm-border text-right">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-cm-green to-cm-green-mid text-white rounded-xl font-bold min-w-[160px] justify-center hover:shadow-lg transition-all disabled:opacity-70"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Sauvegarder</>}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'SECURITY' && (
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-cm-border p-6 sm:p-8 animate-fadeIn">
              <h2 className="font-display text-xl font-bold text-cm-text mb-6">Modifier le mot de passe</h2>
              
              <form onSubmit={handleSecuritySubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-cm-text mb-2">Mot de passe actuel <span className="text-cm-red">*</span></label>
                  <input
                    type="password"
                    required
                    value={securityData.currentPassword}
                    onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                    className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-cm-text mb-2">Nouveau mot de passe <span className="text-cm-red">*</span></label>
                  <input
                    type="password"
                    required
                    value={securityData.newPassword}
                    onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                    className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none"
                  />
                  <p className="text-[10px] text-cm-muted font-medium mt-1">Huit caractères minimum. Utilisez des chiffres et des lettres.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-cm-text mb-2">Confirmer le nouveau mot de passe <span className="text-cm-red">*</span></label>
                  <input
                    type="password"
                    required
                    value={securityData.confirmPassword}
                    onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                    className={`w-full px-4 py-3 bg-cm-cream/50 border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none ${
                      securityData.confirmPassword && securityData.newPassword !== securityData.confirmPassword
                        ? 'border-red-400 bg-red-50'
                        : 'border-cm-border'
                    }`}
                  />
                  {securityData.confirmPassword && securityData.newPassword !== securityData.confirmPassword && (
                    <InlineError message="Les mots de passe ne correspondent pas." />
                  )}
                </div>

                <div className="pt-6 text-right">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-cm-green to-cm-green-mid text-white rounded-xl font-bold min-w-[160px] justify-center hover:shadow-lg transition-all disabled:opacity-70"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : 'Mettre à jour'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ── Composant erreur inline ──
function InlineError({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-1.5 mt-1.5">
      <AlertCircle size={13} className="text-red-500 shrink-0 mt-0.5" />
      <p className="text-xs text-red-600 font-medium leading-tight">{message}</p>
    </div>
  );
}
