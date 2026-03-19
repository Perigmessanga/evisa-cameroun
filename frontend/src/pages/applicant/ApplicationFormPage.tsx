// ─────────────────────────────────────────────
//  pages/applicant/ApplicationFormPage.tsx
// ─────────────────────────────────────────────
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2, Save, FileText, User as UserIcon, MapPin, UploadCloud, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

// ─── VISA TYPES ──────────────────────────────
const VISA_TYPES = [
  { value: 'TOURISM_SHORT', label: 'Visa Tourisme', stayType: 'Court Séjour', maxStay: '30 jours', price: '100 000 XAF' },
  { value: 'TOURISM_LONG', label: 'Visa Tourisme', stayType: 'Long Séjour', maxStay: '3 mois', price: '150 000 XAF' },
  { value: 'BUSINESS_SHORT', label: 'Visa Affaires', stayType: 'Court Séjour', maxStay: '30 jours', price: '150 000 XAF' },
  { value: 'BUSINESS_LONG', label: 'Visa Affaires', stayType: 'Long Séjour', maxStay: '6 mois', price: '200 000 XAF' },
  { value: 'STUDENT', label: 'Visa Étudiant', stayType: 'Long Séjour', maxStay: '1 an renouvelable', price: '100 000 XAF' },
  { value: 'TRANSIT', label: 'Visa Transit', stayType: 'Transit', maxStay: '5 jours', price: '50 000 XAF' },
  { value: 'DIPLOMATIC', label: 'Visa Diplomatique', stayType: 'Variable', maxStay: 'Selon accréditation', price: 'Exonéré' },
  { value: 'HUMANITARIAN', label: 'Visa Humanitaire / ONG', stayType: 'Court / Long Séjour', maxStay: '90 jours', price: '75 000 XAF' },
  { value: 'CONFERENCE', label: 'Visa Conférence / Événement', stayType: 'Court Séjour', maxStay: '15 jours', price: '100 000 XAF' },
  { value: 'JOURNALIST', label: 'Visa Journaliste / Presse', stayType: 'Court Séjour', maxStay: '30 jours', price: '100 000 XAF' },
  { value: 'FAMILY', label: 'Visa Regroupement Familial', stayType: 'Long Séjour', maxStay: '1 an renouvelable', price: '120 000 XAF' },
];

// Required documents per visa type
const DOCUMENTS_BY_TYPE: Record<string, string[]> = {
  TOURISM_SHORT: ['Page bio-data du passeport', 'Billet d\'avion aller-retour', 'Réservation d\'hôtel ou attestation d\'hébergement', 'Photo d\'identité récente (fond blanc)'],
  TOURISM_LONG: ['Page bio-data du passeport', 'Billet d\'avion aller-retour', 'Réservation d\'hôtel ou attestation d\'hébergement', 'Photo d\'identité récente (fond blanc)', 'Justificatif de ressources financières'],
  BUSINESS_SHORT: ['Page bio-data du passeport', 'Lettre d\'invitation de la société camerounaise', 'Carte de visite / justificatif de fonction', 'Photo d\'identité récente (fond blanc)'],
  BUSINESS_LONG: ['Page bio-data du passeport', 'Lettre d\'invitation de la société camerounaise', 'Carte de visite / justificatif de fonction', 'Photo d\'identité récente (fond blanc)', 'Justificatif de ressources financières', 'Contrat ou accord commercial'],
  STUDENT: ['Page bio-data du passeport', 'Lettre d\'acceptation de l\'établissement', 'Preuves de ressources financières', 'Photo d\'identité récente (fond blanc)', 'Relevé de notes / diplôme'],
  TRANSIT: ['Page bio-data du passeport', 'Billet d\'avion de correspondance', 'Visa destination finale si requis'],
  DIPLOMATIC: ['Page bio-data du passeport diplomatique', 'Note verbale du Ministère des Affaires Étrangères'],
  HUMANITARIAN: ['Page bio-data du passeport', 'Lettre de mission de l\'ONG / organisme', 'Accréditation de l\'organisme humanitaire', 'Photo d\'identité récente (fond blanc)'],
  CONFERENCE: ['Page bio-data du passeport', 'Lettre d\'invitation à l\'événement', 'Programme de la conférence', 'Photo d\'identité récente (fond blanc)'],
  JOURNALIST: ['Page bio-data du passeport', 'Carte de presse officielle', 'Lettre de mission de la rédaction', 'Photo d\'identité récente (fond blanc)'],
  FAMILY: ['Page bio-data du passeport', 'Acte de mariage ou certificat de famille', 'Preuve de résidence du membre de famille au Cameroun', 'Photo d\'identité récente (fond blanc)'],
};

// ─── WORLD COUNTRIES ─────────────────────────
const COUNTRIES = [
  'Afghanistan', 'Afrique du Sud', 'Albanie', 'Algérie', 'Allemagne', 'Andorre', 'Angola', 'Antigua-et-Barbuda',
  'Arabie Saoudite', 'Argentine', 'Arménie', 'Australie', 'Autriche', 'Azerbaïdjan',
  'Bahamas', 'Bahreïn', 'Bangladesh', 'Barbade', 'Bélarus', 'Belgique', 'Belize', 'Bénin', 'Bhoutan', 'Bolivie',
  'Bosnie-Herzégovine', 'Botswana', 'Brésil', 'Brunei', 'Bulgarie', 'Burkina Faso', 'Burundi',
  'Cabo Verde', 'Cambodge', 'Cameroun', 'Canada', 'Centrafrique', 'Chili', 'Chine', 'Chypre', 'Colombie',
  'Comores', 'Congo (Brazzaville)', 'Congo (RDC)', 'Corée du Nord', 'Corée du Sud', 'Costa Rica', 'Côte d\'Ivoire',
  'Croatie', 'Cuba', 'Danemark', 'Djibouti', 'Dominique',
  'Égypte', 'Émirats Arabes Unis', 'Équateur', 'Érythrée', 'Espagne', 'Estonie', 'Eswatini', 'Éthiopie',
  'Fidji', 'Finlande', 'France',
  'Gabon', 'Gambie', 'Géorgie', 'Ghana', 'Grèce', 'Grenade', 'Guatemala', 'Guinée', 'Guinée-Bissau', 'Guinée Équatoriale', 'Guyana',
  'Haïti', 'Honduras', 'Hongrie',
  'Inde', 'Indonésie', 'Irak', 'Iran', 'Irlande', 'Islande', 'Israël', 'Italie',
  'Jamaïque', 'Japon', 'Jordanie', 'Kazakhstan', 'Kenya', 'Kirghizistan', 'Kiribati', 'Kosovo', 'Koweït',
  'Laos', 'Lesotho', 'Lettonie', 'Liban', 'Libéria', 'Libye', 'Liechtenstein', 'Lituanie', 'Luxembourg',
  'Madagascar', 'Malaisie', 'Malawi', 'Maldives', 'Mali', 'Malte', 'Maroc', 'Marshall', 'Mauritanie', 'Maurice',
  'Mexique', 'Micronésie', 'Moldavie', 'Monaco', 'Mongolie', 'Monténégro', 'Mozambique', 'Myanmar',
  'Namibie', 'Nauru', 'Népal', 'Nicaragua', 'Niger', 'Nigeria', 'Norvège', 'Nouvelle-Zélande',
  'Oman', 'Ouganda', 'Ouzbékistan', 'Pakistan', 'Palaos', 'Palestine', 'Panama', 'Papouasie-Nouvelle-Guinée',
  'Paraguay', 'Pays-Bas', 'Pérou', 'Philippines', 'Pologne', 'Portugal',
  'Qatar', 'République Dominicaine', 'Roumanie', 'Royaume-Uni', 'Russie', 'Rwanda',
  'Saint-Kitts-et-Nevis', 'Saint-Marin', 'Saint-Vincent', 'Sainte-Lucie', 'Salomon', 'Salvador', 'Samoa',
  'São Tomé-et-Príncipe', 'Sénégal', 'Serbie', 'Seychelles', 'Sierra Leone', 'Singapour', 'Slovaquie',
  'Slovénie', 'Somalie', 'Soudan', 'Soudan du Sud', 'Sri Lanka', 'Suède', 'Suisse', 'Suriname', 'Syrie',
  'Tadjikistan', 'Tanzanie', 'Thaïlande', 'Timor-Leste', 'Togo', 'Tonga', 'Trinité-et-Tobago', 'Tunisie',
  'Turkménistan', 'Turquie', 'Tuvalu',
  'Ukraine', 'Uruguay', 'États-Unis', 'Vatican', 'Venezuela', 'Vietnam',
  'Yémen', 'Zambie', 'Zimbabwe',
];

const STEPS = [
  { id: 'type', title: 'Type de Visa', icon: <FileText size={20} /> },
  { id: 'personal', title: 'Infos Personnelles', icon: <UserIcon size={20} /> },
  { id: 'passport', title: 'Passeport & Voyage', icon: <MapPin size={20} /> },
  { id: 'documents', title: 'Documents', icon: <UploadCloud size={20} /> },
];

const DRAFT_KEY = 'evisa_draft';

export default function ApplicationFormPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    return saved ? JSON.parse(saved) : {
      visaType: '',
      entryType: 'SINGLE',
      purpose: '',
      firstName: '',
      lastName: '',
      birthDate: '',
      age: '',
      gender: '',
      maritalStatus: '',
      profession: '',
      nationality: '',
      birthCountry: '',
      passportNumber: '',
      passportIssueDate: '',
      passportExpiryDate: '',
      passportIssuingCountry: '',
      arrivalDate: '',
      departureDate: '',
      addressInCameroon: '',
      emergencyName: '',
      emergencyPhone: '',
    };
  });

  // Extra document files
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>>({});
  const [extraDocs, setExtraDocs] = useState<string[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev: Record<string, string>) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleFile = (name: string, file: File | null) => {
    setUploadedFiles(prev => ({ ...prev, [name]: file }));
  };

  const addExtraDoc = () => {
    setExtraDocs(prev => [...prev, `Document supplémentaire ${prev.length + 1}`]);
  };

  const removeExtraDoc = (i: number) => {
    setExtraDocs(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSaveDraft = () => {
    try {
      const draftData = {
        ...formData,
        draftId: formData.draftId || `DRAFT-${Date.now()}`,
        savedAt: new Date().toISOString(),
        stepReached: currentStep,
        status: 'DRAFT',
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
      // Also keep a list of all drafts
      const allDrafts: Record<string, unknown>[] = JSON.parse(localStorage.getItem('evisa_all_drafts') || '[]');
      const existing = allDrafts.findIndex((d: Record<string, unknown>) => d.draftId === draftData.draftId);
      if (existing >= 0) {
        allDrafts[existing] = draftData;
      } else {
        allDrafts.push(draftData);
      }
      localStorage.setItem('evisa_all_drafts', JSON.stringify(allDrafts));
      toast.success('Brouillon sauvegardé ! Vous pouvez reprendre depuis votre liste de brouillons.');
    } catch {
      toast.error('Impossible de sauvegarder le brouillon.');
    }
  };

  const handleNext = () => {
    if (currentStep === 0 && !formData.visaType) {
      toast.error('Veuillez sélectionner un type de visa.'); return;
    }
    if (currentStep === 1) {
      if (!formData.firstName || !formData.lastName || !formData.birthDate || !formData.nationality || !formData.gender) {
        toast.error('Veuillez remplir tous les champs obligatoires.'); return;
      }
    }
    if (currentStep === 2) {
      if (!formData.passportNumber || !formData.passportExpiryDate || !formData.arrivalDate) {
        toast.error('Veuillez remplir tous les champs obligatoires.'); return;
      }
    }
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      toast.error('Veuillez accepter la déclaration sur l\'honneur.'); return;
    }
    const requiredDocs = DOCUMENTS_BY_TYPE[formData.visaType] || [];
    const missingDocs = requiredDocs.filter(d => !uploadedFiles[d]);
    if (missingDocs.length > 0) {
      toast.error(`Veuillez téléverser : ${missingDocs[0]}`); return;
    }
    setLoading(true);
    try {
      // Save the application in local storage and clear draft
      const selectedVisa = VISA_TYPES.find(v => v.value === formData.visaType);
      const newApp = {
        id: `VA-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000) + 10000}`,
        type: selectedVisa?.label || formData.visaType,
        price: selectedVisa?.price || '0 XAF',
        submissionDate: new Date().toISOString(),
        lastUpdate: new Date().toISOString(),
        status: 'SUBMITTED',
        country: formData.nationality,
      };
      const apps: unknown[] = JSON.parse(localStorage.getItem('evisa_applications') || '[]');
      apps.push(newApp);
      localStorage.setItem('evisa_applications', JSON.stringify(apps));
      localStorage.removeItem(DRAFT_KEY);
      toast.success('Documents vérifiés. Redirection vers le paiement...');
      setTimeout(() => navigate('/applicant/payment'), 1500);
    } finally {
      setLoading(false);
    }
  };

  const selectedVisaType = VISA_TYPES.find(v => v.value === formData.visaType);
  const requiredDocs = DOCUMENTS_BY_TYPE[formData.visaType] || [];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8 animate-fadeIn">
            <h2 className="text-xl font-bold text-cm-text">Informations sur la demande</h2>

            {/* Visa Type Picker */}
            <div>
              <label className="block text-sm font-semibold text-cm-text mb-3">Type de visa demandé <span className="text-cm-red">*</span></label>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {VISA_TYPES.map(v => (
                  <label key={v.value} className={`relative flex flex-col p-4 border-2 rounded-2xl cursor-pointer transition-all ${formData.visaType === v.value ? 'border-cm-green-mid bg-cm-green-pale/10 shadow-md' : 'border-cm-border bg-white hover:border-cm-green-pale hover:bg-cm-cream/30'}`}>
                    <input type="radio" name="visaType" value={v.value} checked={formData.visaType === v.value} onChange={handleChange} className="sr-only" />
                    <div className="font-bold text-cm-text text-sm leading-tight">{v.label}</div>
                    <div className="text-xs text-cm-muted mt-1">{v.stayType} — max {v.maxStay}</div>
                    <div className="text-xs font-bold text-cm-green-mid mt-2">{v.price}</div>
                    {formData.visaType === v.value && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-cm-green-mid flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {selectedVisaType && (
              <div className="bg-cm-green-pale/10 border border-cm-green-pale/40 rounded-2xl p-5 flex gap-4 animate-fadeIn">
                <div className="w-10 h-10 rounded-xl bg-cm-green/10 flex items-center justify-center shrink-0">
                  <FileText size={20} className="text-cm-green-mid" />
                </div>
                <div>
                  <div className="font-bold text-cm-text text-sm">{selectedVisaType.label} — {selectedVisaType.stayType}</div>
                  <div className="text-xs text-cm-muted mt-1">Durée max : <strong>{selectedVisaType.maxStay}</strong> • Frais : <strong>{selectedVisaType.price}</strong></div>
                </div>
              </div>
            )}

            {/* Entry Type */}
            <div>
              <label className="block text-sm font-semibold text-cm-text mb-3">Type d'entrée</label>
              <div className="flex gap-4">
                {[{ val: 'SINGLE', label: 'Entrée simple' }, { val: 'MULTIPLE', label: 'Entrées multiples' }].map(et => (
                  <label key={et.val} className={`flex-1 flex items-center gap-3 px-4 py-3 border-2 rounded-xl cursor-pointer transition-all ${formData.entryType === et.val ? 'border-cm-green-mid bg-cm-green-pale/10' : 'border-cm-border hover:border-cm-green-pale'}`}>
                    <input type="radio" name="entryType" value={et.val} checked={formData.entryType === et.val} onChange={handleChange} className="text-cm-green-mid" />
                    <span className="text-sm font-semibold text-cm-text">{et.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-sm font-semibold text-cm-text mb-2">Motif détaillé du voyage</label>
              <textarea name="purpose" value={formData.purpose} onChange={handleChange} rows={4} className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none resize-none" placeholder="Expliquez brièvement le but de votre séjour au Cameroun..." />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-cm-text">Informations Personnelles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Prénom(s)" name="firstName" value={formData.firstName} onChange={handleChange} required />
              <Field label="Nom de famille" name="lastName" value={formData.lastName} onChange={handleChange} required />
              <Field label="Date de naissance" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} required />
              <Field label="Âge" name="age" type="number" value={formData.age} onChange={handleChange} placeholder="Ex: 32" />

              <div>
                <label className="block text-sm font-semibold text-cm-text mb-2">Sexe <span className="text-cm-red">*</span></label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none">
                  <option value="">Sélectionner</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-cm-text mb-2">Situation matrimoniale</label>
                <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none">
                  <option value="">Sélectionner</option>
                  <option value="CELIBATAIRE">Célibataire</option>
                  <option value="MARIE">Marié(e)</option>
                  <option value="DIVORCE">Divorcé(e)</option>
                  <option value="VEUF">Veuf / Veuve</option>
                  <option value="CONCUBINAGE">Union libre</option>
                </select>
              </div>

              <Field label="Profession / Fonction" name="profession" value={formData.profession} onChange={handleChange} placeholder="Ex: Ingénieur, Médecin..." />

              <div>
                <label className="block text-sm font-semibold text-cm-text mb-2">Nationalité actuelle <span className="text-cm-red">*</span></label>
                <select name="nationality" value={formData.nationality} onChange={handleChange} className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none">
                  <option value="">Sélectionnez un pays</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-cm-text mb-2">Pays de naissance</label>
                <select name="birthCountry" value={formData.birthCountry} onChange={handleChange} className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none">
                  <option value="">Sélectionnez un pays</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="md:col-span-2 border-t border-cm-border/50 pt-4">
                <p className="text-xs font-bold text-cm-muted uppercase tracking-wider mb-4">Contact d'urgence</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Nom complet" name="emergencyName" value={formData.emergencyName} onChange={handleChange} placeholder="Nom du contact d'urgence" />
                  <Field label="Téléphone" name="emergencyPhone" type="tel" value={formData.emergencyPhone} onChange={handleChange} placeholder="+33 6 00 00 00 00" />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-cm-text">Passeport et Détails de Voyage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <Field label="Numéro de passeport" name="passportNumber" value={formData.passportNumber} onChange={handleChange} required placeholder="Ex: AB1234567" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-cm-text mb-2">Pays délivrant le passeport</label>
                <select name="passportIssuingCountry" value={formData.passportIssuingCountry} onChange={handleChange} className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none">
                  <option value="">Sélectionnez un pays</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <Field label="Date de délivrance" name="passportIssueDate" type="date" value={formData.passportIssueDate} onChange={handleChange} />
              <Field label="Date d'expiration" name="passportExpiryDate" type="date" value={formData.passportExpiryDate} onChange={handleChange} required />
              <Field label="Date prévue d'arrivée au Cameroun" name="arrivalDate" type="date" value={formData.arrivalDate} onChange={handleChange} required />
              <Field label="Date prévue de départ" name="departureDate" type="date" value={formData.departureDate} onChange={handleChange} />
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-cm-text mb-2">Adresse de séjour au Cameroun (Hôtel ou Hôte) <span className="text-cm-red">*</span></label>
                <textarea name="addressInCameroon" value={formData.addressInCameroon} onChange={handleChange} rows={3} className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none resize-none" placeholder="Nom de l'hôtel, ville, quartier..." />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-cm-text">Pièces Justificatives</h2>
                <p className="text-sm text-cm-muted mt-1">Téléversez tous vos documents en format PDF (max 5 Mo/fichier).</p>
              </div>
              {selectedVisaType && (
                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-cm-muted uppercase">Visa sélectionné</div>
                  <div className="text-sm font-bold text-cm-green-mid">{selectedVisaType.label}</div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {requiredDocs.map((doc, i) => {
                const file = uploadedFiles[doc];
                return (
                  <div key={i} className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 border-2 border-dashed rounded-2xl transition-colors ${file ? 'border-cm-green-mid bg-cm-green-pale/10' : 'border-cm-border bg-white hover:bg-cm-cream/20'}`}>
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${file ? 'bg-cm-green/20' : 'bg-cm-cream'}`}>
                        {file ? (
                          <svg className="w-4 h-4 text-cm-green-mid" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        ) : (
                          <UploadCloud size={16} className="text-cm-muted" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-cm-text">{doc} <span className="text-cm-red">*</span></h4>
                        {file ? (
                          <p className="text-xs text-cm-green-mid mt-0.5 font-medium">{file.name}</p>
                        ) : (
                          <p className="text-xs text-cm-muted mt-0.5">Scanné, clair et lisible — PDF, JPG ou PNG</p>
                        )}
                      </div>
                    </div>
                    <label className={`mt-3 sm:mt-0 px-4 py-2 rounded-xl font-bold text-sm cursor-pointer transition-colors shrink-0 ${file ? 'bg-cm-green-pale/20 text-cm-green-mid hover:bg-cm-green-pale/30' : 'bg-cm-cream text-cm-text hover:bg-cm-border/50'}`}>
                      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e => handleFile(doc, e.target.files?.[0] || null)} />
                      {file ? 'Modifier' : 'Choisir un fichier'}
                    </label>
                  </div>
                );
              })}

              {/* Extra documents */}
              {extraDocs.map((doc, i) => {
                const file = uploadedFiles[`extra-${i}`];
                return (
                  <div key={`extra-${i}`} className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 border-2 border-dashed rounded-2xl transition-colors ${file ? 'border-cm-green-mid bg-cm-green-pale/10' : 'border-cm-gold/50 bg-cm-gold-pale/5'}`}>
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${file ? 'bg-cm-green/20' : 'bg-cm-gold/20'}`}>
                        {file ? (
                          <svg className="w-4 h-4 text-cm-green-mid" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        ) : (
                          <UploadCloud size={16} className="text-cm-gold" />
                        )}
                      </div>
                      <div className="flex-1 w-full mr-4">
                        <input
                          type="text"
                          defaultValue={doc}
                          placeholder="Nom du document supplémentaire"
                          className="text-sm font-semibold text-cm-text bg-transparent outline-none w-full mb-1"
                          onChange={e => setExtraDocs(prev => prev.map((d, idx) => idx === i ? e.target.value : d))}
                        />
                        {file ? (
                          <p className="text-xs text-cm-green-mid font-medium">{file.name}</p>
                        ) : (
                          <p className="text-xs text-cm-muted">Scanné, clair et lisible — PDF, JPG ou PNG</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-0 flex gap-2 shrink-0">
                      <label className={`px-4 py-2 rounded-xl font-bold text-sm cursor-pointer transition-colors ${file ? 'bg-cm-green-pale/20 text-cm-green-mid hover:bg-cm-green-pale/30' : 'bg-cm-cream text-cm-text hover:bg-cm-border/50'}`}>
                        <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e => handleFile(`extra-${i}`, e.target.files?.[0] || null)} />
                        {file ? 'Modifier' : 'Choisir un fichier'}
                      </label>
                      <button type="button" onClick={() => removeExtraDoc(i)} className="p-2 text-cm-red hover:bg-cm-red/5 rounded-xl transition-colors" title="Supprimer">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}

              <button type="button" onClick={addExtraDoc} className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-cm-gold/40 rounded-2xl text-cm-gold hover:bg-cm-gold-pale/10 transition-colors font-semibold text-sm">
                <Plus size={18} /> Ajouter un document supplémentaire
              </button>
            </div>

            {/* Terms */}
            <div className="bg-cm-green-pale/10 border border-cm-green-pale/30 rounded-2xl p-5 mt-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="mt-1 shrink-0 text-cm-green-mid focus:ring-cm-green w-4 h-4 rounded" />
                <span className="text-sm font-medium text-cm-text leading-relaxed">
                  Je certifie sur l'honneur que les informations fournies dans ce formulaire sont exactes et véridiques. Je reconnais que toute fausse déclaration peut entraîner le rejet de ma demande ou l'annulation de mon visa.
                </span>
              </label>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fadeIn">

      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-cm-text">Nouvelle Demande de Visa</h1>
          <p className="text-cm-muted mt-1">Remplissez soigneusement chaque étape de votre dossier.</p>
        </div>
        <button onClick={handleSaveDraft} className="flex items-center gap-2 px-4 py-2 bg-white border border-cm-border text-cm-text rounded-xl font-bold text-sm hover:bg-cm-cream transition-colors">
          <Save size={16} /> Sauvegarder (Brouillon)
        </button>
      </div>

      {/* ── STEPPER ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-cm-border mb-8 overflow-hidden">
        <div className="flex flex-col sm:flex-row relative">
          {STEPS.map((step, index) => {
            const isActive = currentStep === index;
            const isCompleted = currentStep > index;
            return (
              <div key={step.id} className={`flex-1 flex items-center p-4 sm:p-5 relative ${index !== STEPS.length - 1 ? 'border-b sm:border-b-0 sm:border-r border-cm-border' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mr-3 transition-colors ${isActive ? 'bg-cm-green-mid text-white ring-4 ring-cm-green-pale/20' : isCompleted ? 'bg-cm-green-pale/30 text-cm-green-mid' : 'bg-cm-cream text-cm-muted'}`}>
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  ) : step.icon}
                </div>
                <div>
                  <div className="text-[10px] font-bold text-cm-muted uppercase tracking-wider mb-0.5">Étape {index + 1}</div>
                  <div className={`text-sm font-bold ${isActive || isCompleted ? 'text-cm-text' : 'text-cm-muted'}`}>{step.title}</div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Progress bar */}
        <div className="h-1 w-full bg-cm-border/30">
          <div className="h-1 bg-linear-to-r from-cm-green to-cm-gold transition-all duration-500" style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }} />
        </div>
      </div>

      {/* ── FORM CONTENT ── */}
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-cm-border p-6 md:p-10">
        <form onSubmit={handleSubmit}>
          <div className="min-h-[400px]">
            {renderStepContent()}
          </div>

          <div className="pt-8 mt-8 border-t border-cm-border flex justify-between items-center">
            {currentStep > 0 ? (
              <button type="button" onClick={handlePrev} className="flex items-center gap-2 px-6 py-3 bg-cm-cream text-cm-text rounded-xl font-bold hover:bg-cm-border/50 transition-colors">
                <ArrowLeft size={18} /> Précédent
              </button>
            ) : <div />}

            {currentStep < STEPS.length - 1 ? (
              <button type="button" onClick={handleNext} className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-cm-green to-cm-green-mid text-white rounded-xl font-bold hover:shadow-lg transition-all">
                Suivant <ArrowRight size={18} />
              </button>
            ) : (
              <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 px-8 py-3 bg-linear-to-r from-cm-gold to-cm-gold-light text-cm-dark rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0">
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Soumettre et Payer'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Helper Field component ──
function Field({ label, name, value, onChange, type = 'text', required = false, placeholder = '' }: {
  label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-cm-text mb-2">
        {label} {required && <span className="text-cm-red">*</span>}
      </label>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none" />
    </div>
  );
}
