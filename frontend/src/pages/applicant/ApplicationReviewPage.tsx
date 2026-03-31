// ─────────────────────────────────────────────
//  pages/applicant/ApplicationReviewPage.tsx
// ─────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FileCheck, 
  User, 
  MapPin, 
  History, 
  CreditCard, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import applicationService from '../../services/applicationService';
import toast from 'react-hot-toast';
import type { VisaApplication } from '../../types';

export default function ApplicationReviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const applicationId = location.state?.applicationId;
  
  const [application, setApplication] = useState<VisaApplication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!applicationId) {
      toast.error('Aucune demande trouvée.');
      navigate('/applicant/dashboard');
      return;
    }

    applicationService.getApplication(applicationId)
      .then((res: VisaApplication) => setApplication(res))
      .catch(() => toast.error('Erreur lors de la récupération de la demande.'))
      .finally(() => setLoading(false));
  }, [applicationId, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 size={40} className="text-cm-green animate-spin mb-4" />
        <p className="text-cm-muted font-bold">Chargement de votre récapitulatif...</p>
      </div>
    );
  }

  if (!application) return null;

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fadeIn space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-cm-text">Révision et Confirmation</h1>
            <p className="text-cm-muted mt-1">Vérifiez vos informations avant de procéder au paiement.</p>
          </div>
          <div className="bg-cm-gold/10 text-cm-gold px-4 py-2 rounded-xl font-bold text-sm border border-cm-gold/20 flex items-center gap-2">
            <AlertTriangle size={16} /> Étape finale avant paiement
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── MAIN REVIEW PANEL ── */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Identity & Personal */}
          <section className="bg-white rounded-2xl p-6 border border-cm-border shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-cm-border pb-4">
              <div className="w-10 h-10 rounded-xl bg-cm-green/10 flex items-center justify-center text-cm-green">
                <User size={20} />
              </div>
              <h3 className="font-bold text-cm-text">Identité et Informations Personnelles</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <DataLabel label="Nom Complet" value={application.full_name} />
              <DataLabel label="Date de Naissance" value={application.date_of_birth} />
              <DataLabel label="Lieu de Naissance" value={application.place_of_birth} />
              <DataLabel label="Nationalité" value={application.nationality} />
              <DataLabel label="Sexe" value={application.gender === 'MALE' ? 'Masculin' : 'Féminin'} />
              <DataLabel label="Profession" value={application.profession || 'Non spécifié'} />
            </div>
          </section>

          {/* Travel & Passport */}
          <section className="bg-white rounded-2xl p-6 border border-cm-border shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-cm-border pb-4">
              <div className="w-10 h-10 rounded-xl bg-cm-gold/10 flex items-center justify-center text-cm-gold">
                <MapPin size={20} />
              </div>
              <h3 className="font-bold text-cm-text">Passeport et Voyage</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <DataLabel label="N° Passeport" value={application.passport_number} />
              <DataLabel label="Pays de délivrance" value={application.passport_country} />
              <DataLabel label="Période" value={`${application.arrival_date} au ${application.departure_date}`} />
              <DataLabel label="Type de Visa" value={application.visa_type?.name} />
              <div className="col-span-1 sm:col-span-2">
                <DataLabel label="Adresse au Cameroun" value={application.address_in_cameroon} />
              </div>
            </div>
          </section>

          {/* Documents Uploaded */}
          <section className="bg-white rounded-2xl p-6 border border-cm-border shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-cm-border pb-4">
              <div className="w-10 h-10 rounded-xl bg-cm-green-pale/30 flex items-center justify-center text-cm-green-mid">
                <FileCheck size={20} />
              </div>
              <h3 className="font-bold text-cm-text">Documents Téléversés</h3>
            </div>
            
            <div className="space-y-3">
              {application.documents?.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-cm-cream/30 rounded-xl border border-cm-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-cm-green-mid border border-cm-border">
                      <FileCheck size={14} />
                    </div>
                    <span className="text-sm font-medium text-cm-text">{doc.document_type}</span>
                  </div>
                  <span className="text-[10px] font-bold text-cm-green-mid uppercase tracking-widest bg-cm-green/5 px-2 py-1 rounded">PRÉSENT</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── SIDEBAR: FEES & ACTION ── */}
        <div className="space-y-6">
          <div className="bg-cm-dark rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cm-gold/10 rounded-full -mr-16 -mt-16 blur-3xl animate-pulse" />
            
            <h4 className="font-bold text-cm-gold-light text-xs uppercase tracking-widest mb-6">RECAPITULATIF FINANCIER</h4>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm text-white/70">
                <span>Frais de dossier visa</span>
                <span>{application.visa_type?.fee?.toLocaleString()} XAF</span>
              </div>
              <div className="flex justify-between text-sm text-white/70">
                <span>Frais de service (E-Visa)</span>
                <span>0 XAF</span>
              </div>
              <div className="border-t border-white/10 pt-4 mt-4 flex justify-between items-baseline">
                <span className="font-bold">TOTAL À PAYER</span>
                <span className="text-3xl font-display font-bold text-cm-gold">
                  {application.visa_type?.fee?.toLocaleString()} <span className="text-xs">XAF</span>
                </span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/applicant/payment', { state: { applicationId } })}
              className="w-full py-4 bg-linear-to-r from-cm-gold to-cm-gold-light text-cm-dark font-bold rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
            >
              Procéder au paiement <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="text-[10px] text-white/40 text-center mt-6 leading-relaxed">
              En procédant au paiement, vous confirmez l'exactitude des informations fournies. Aucun remboursement n'est possible après le début de l'instruction.
            </p>
          </div>


          <button 
            onClick={() => navigate('/applicant/application', { state: { editId: applicationId } })}
            className="w-full flex items-center justify-center gap-2 py-4 bg-white border border-cm-border text-cm-text font-bold rounded-2xl hover:bg-cm-cream transition-colors"
          >
            <ArrowLeft size={18} /> Modifier ma demande
          </button>
        </div>
      </div>
    </div>
  );
}

function DataLabel({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div>
      <div className="text-[10px] font-bold text-cm-muted uppercase tracking-wider mb-1">{label}</div>
      <div className="font-semibold text-cm-text">{value || '—'}</div>
    </div>
  );
}
