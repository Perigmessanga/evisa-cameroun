// ─────────────────────────────────────────────
//  pages/applicant/ApplicationFormPage.tsx
// ─────────────────────────────────────────────
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2, Save, FileText, User as UserIcon, Building2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const STEPS = [
  { id: 'type', title: 'Type de Visa', icon: <FileText size={20} /> },
  { id: 'personal', title: 'Infos Personnelles', icon: <UserIcon size={20} /> },
  { id: 'passport', title: 'Passeport & Voyage', icon: <MapPin size={20} /> },
  { id: 'documents', title: 'Documents', icon: <Building2 size={20} /> }
];

export default function ApplicationFormPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Minimal form state to hold values for each step
  const [formData, setFormData] = useState({
    visaType: '',
    entryType: 'SINGLE',
    purpose: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    nationality: '',
    passportNumber: '',
    passportIssueDate: '',
    passportExpiryDate: '',
    arrivalDate: '',
    departureDate: '',
    addressInCameroon: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = () => {
    // Basic validation depending on step
    if (currentStep === 0 && !formData.visaType) {
      toast.error('Veuillez sélectionner un type de visa.');
      return;
    }
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  const handleSaveDraft = () => {
    toast.success('Brouillon sauvegardé avec succès.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Demande soumise avec succès, redirection vers le paiement...');
      navigate('/applicant/payment');
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-cm-text">Informations sur la demande</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-cm-text mb-2">Type de visa demandé <span className="text-cm-red">*</span></label>
                <select 
                  name="visaType" 
                  value={formData.visaType} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none"
                >
                  <option value="">Sélectionnez un type</option>
                  <option value="TOURISM_SHORT">Visa Tourisme (Court Séjour - max 90 jours)</option>
                  <option value="BUSINESS_SHORT">Visa Affaires (Court Séjour - max 90 jours)</option>
                  <option value="TOURISM_LONG">Visa Tourisme (Long Séjour - max 6 mois)</option>
                  <option value="STUDENT">Visa Étudiant</option>
                  <option value="TRANSIT">Visa Transit (max 5 jours)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-cm-text mb-2">Type d'entrée</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="entryType" value="SINGLE" checked={formData.entryType === 'SINGLE'} onChange={handleChange} className="text-cm-green-mid focus:ring-cm-green" />
                    <span className="text-sm font-medium">Entrée simple</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="entryType" value="MULTIPLE" checked={formData.entryType === 'MULTIPLE'} onChange={handleChange} className="text-cm-green-mid focus:ring-cm-green" />
                    <span className="text-sm font-medium">Entrées multiples</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-cm-text mb-2">Motif détaillé du voyage</label>
                <textarea 
                  name="purpose" 
                  value={formData.purpose} 
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none resize-none"
                  placeholder="Expliquez brièvement le but de votre séjour au Cameroun..."
                />
              </div>
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-cm-text">Informations Personnelles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-cm-text mb-2">Prénom(s) <span className="text-cm-red">*</span></label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-cm-text mb-2">Nom de famille <span className="text-cm-red">*</span></label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-cm-text mb-2">Date de naissance <span className="text-cm-red">*</span></label>
                <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-cm-text mb-2">Nationalité actuelle <span className="text-cm-red">*</span></label>
                <select name="nationality" value={formData.nationality} onChange={handleChange} className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none">
                  <option value="">Sélectionnez un pays</option>
                  <option value="FR">France</option>
                  <option value="CA">Canada</option>
                  <option value="US">États-Unis</option>
                  <option value="GB">Royaume-Uni</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-cm-text">Passeport et Détails de Voyage</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-cm-text mb-2">Numéro de passeport <span className="text-cm-red">*</span></label>
                <input type="text" name="passportNumber" value={formData.passportNumber} onChange={handleChange} className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-cm-text mb-2">Date de délivrance</label>
                <input type="date" name="passportIssueDate" value={formData.passportIssueDate} onChange={handleChange} className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-cm-text mb-2">Date d'expiration</label>
                <input type="date" name="passportExpiryDate" value={formData.passportExpiryDate} onChange={handleChange} className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-cm-text mb-2">Date prévue d'arrivée</label>
                <input type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-cm-text mb-2">Date prévue de départ</label>
                <input type="date" name="departureDate" value={formData.departureDate} onChange={handleChange} className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-cm-text mb-2">Adresse de séjour au Cameroun (Hôtel ou Hôte)</label>
                <textarea name="addressInCameroon" value={formData.addressInCameroon} onChange={handleChange} rows={3} className="w-full px-4 py-3 bg-cm-cream/50 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none resize-none" />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-cm-text">Pièces Jointes</h2>
            <p className="text-sm text-cm-muted">Veuillez fournir les documents requis au format PDF, JPG ou PNG (Max 5Mo/fichier).</p>
            
            <div className="space-y-4">
              {[
                { label: 'Page bio-data du passeport', required: true },
                { label: 'Billet d\'avion aller-retour', required: true },
                { label: 'Certificat d\'hébergement ou réservation d\'hôtel', required: true },
                { label: 'Photo d\'identité récente (fond blanc)', required: true },
              ].map((doc, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-cm-border border-dashed rounded-2xl bg-white hover:bg-cm-cream/20 transition-colors gap-4">
                  <div>
                    <h4 className="font-semibold text-sm text-cm-text">{doc.label} {doc.required && <span className="text-cm-red">*</span>}</h4>
                    <p className="text-xs text-cm-muted mt-0.5">Scanné, clair et lisible.</p>
                  </div>
                  <label className="px-4 py-2 bg-cm-cream text-cm-text font-bold text-sm rounded-lg hover:bg-cm-border/50 cursor-pointer transition-colors text-center shrink-0">
                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                    Choisir un fichier
                  </label>
                </div>
              ))}
            </div>

            <div className="bg-cm-green-pale/10 border border-cm-green-pale/30 rounded-2xl p-5 mt-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 shrink-0 text-cm-green-mid focus:ring-cm-green" />
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
          <h1 className="font-display text-3xl font-bold text-cm-text">Nouvelle Demande</h1>
          <p className="text-cm-muted mt-1">Saisie de votre dossier de visa électronique.</p>
        </div>
        <button 
          onClick={handleSaveDraft}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-cm-border text-cm-text rounded-xl font-bold text-sm hover:bg-cm-cream transition-colors"
        >
          <Save size={16} /> Sauvegarder (Brouillon)
        </button>
      </div>

      {/* ── STEPPER ── */}
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-cm-border mb-8 overflow-hidden">
        <div className="flex flex-col sm:flex-row relative">
          {STEPS.map((step, index) => {
            const isActive = currentStep === index;
            const isCompleted = currentStep > index;
            
            return (
              <div key={step.id} className={`flex-1 flex items-center p-4 sm:p-5 relative ${index !== STEPS.length - 1 ? 'border-b sm:border-b-0 sm:border-r border-cm-border text-center sm:text-left' : ''}`}>
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center shrink-0 mr-3 transition-colors
                  ${isActive ? 'bg-cm-green-mid text-white ring-4 ring-cm-green-pale/20' : 
                    isCompleted ? 'bg-cm-green-pale/30 text-cm-green-mid' : 'bg-cm-cream text-cm-muted'}
                `}>
                  {step.icon}
                </div>
                <div>
                  <div className="text-[10px] font-bold text-cm-muted uppercase tracking-wider mb-0.5">Étape {index + 1}</div>
                  <div className={`text-sm font-bold ${isActive || isCompleted ? 'text-cm-text' : 'text-cm-muted'}`}>
                    {step.title}
                  </div>
                </div>
              </div>
            );
          })}
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
              <button
                type="button"
                onClick={handlePrev}
                className="flex items-center gap-2 px-6 py-3 bg-cm-cream text-cm-text rounded-xl font-bold hover:bg-cm-border/50 transition-colors"
              >
                <ArrowLeft size={18} /> Précédent
              </button>
            ) : <div />}

            {currentStep < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-cm-green to-cm-green-mid text-white rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Suivant <ArrowRight size={18} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-linear-to-r from-cm-gold to-cm-gold-light text-cm-dark rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Soumettre ma demande'}
              </button>
            )}
          </div>
          
        </form>
      </div>
      
    </div>
  );
}
