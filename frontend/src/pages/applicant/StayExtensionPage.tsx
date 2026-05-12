import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Calendar, AlertCircle, CheckCircle2, RefreshCcw, Send, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import applicationService from '../../services/applicationService';
import type { VisaApplication } from '../../types';
import { formatDate } from '../../utils/formatters';

export default function StayExtensionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [application, setApplication] = useState<VisaApplication | null>(null);
  
  const [requestedDays, setRequestedDays] = useState<number>(15);
  const [reason, setReason] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      applicationService.getApplicationById(id)
        .then(res => {
          setApplication(res);
          // Vérification de l'éligibilité
          if (res.status !== 'APPROVED') {
            toast.error("Seuls les visas approuvés peuvent être prorogés.");
            navigate('/applicant/dashboard');
          }
          if (res.border_check_status !== 'ENTERED') {
            toast.error("Vous devez être entré sur le territoire pour demander une prorogation.");
            navigate('/applicant/dashboard');
          }
        })
        .catch(err => {
          console.error(err);
          toast.error("Erreur lors du chargement de la demande.");
          navigate('/applicant/dashboard');
        })
        .finally(() => setLoading(false));
    }
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Veuillez fournir un motif pour votre demande.");
      return;
    }

    setSubmitting(true);
    try {
      await applicationService.createStayExtension({
        visa_application: id!,
        requested_days: requestedDays,
        reason: reason
      });
      setSuccess(true);
      toast.success("Demande de prorogation soumise avec succès !");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Erreur lors de la soumission de la demande.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 size={40} className="text-cm-green-mid animate-spin mb-4" />
        <p className="text-cm-muted font-medium">Chargement des détails du visa...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-fadeIn">
        <div className="bg-white rounded-3xl shadow-xl border border-cm-border p-8 text-center">
          <div className="w-20 h-20 bg-cm-green-pale/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-cm-green-mid" />
          </div>
          <h1 className="text-2xl font-bold text-cm-text mb-4">Demande Envoyée !</h1>
          <p className="text-cm-muted mb-8">
            Votre demande de prorogation de séjour pour le visa <strong>{application?.application_number}</strong> a été transmise aux autorités. 
            Elle sera traitée par l'agent ou l'ambassade qui a initialement approuvé votre visa.
          </p>
          <div className="bg-cm-cream/30 rounded-2xl p-6 mb-8 text-left">
            <h4 className="text-sm font-bold text-cm-text uppercase tracking-wider mb-3">Résumé de la demande</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-cm-muted">Jours demandés :</span>
                <span className="font-bold text-cm-text">+{requestedDays} jours</span>
              </li>
              <li className="flex justify-between">
                <span className="text-cm-muted">Statut :</span>
                <span className="px-2 py-0.5 rounded-full bg-cm-gold/20 text-cm-gold font-bold text-[10px]">SOUMISE</span>
              </li>
            </ul>
          </div>
          <Link 
            to="/applicant/dashboard" 
            className="inline-flex items-center gap-2 px-8 py-3 bg-cm-green-mid text-white rounded-xl font-bold hover:bg-cm-green transition-all"
          >
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-20 animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <Link to="/applicant/dashboard" className="inline-flex items-center gap-2 text-cm-muted hover:text-cm-green-mid transition-colors mb-4 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm">Retour</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cm-gold/10 flex items-center justify-center">
            <RefreshCcw size={24} className="text-cm-gold" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-cm-text">Prorogation de séjour</h1>
            <p className="text-cm-muted">Demandez une extension de votre droit de séjour au Cameroun.</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-cm-border overflow-hidden">
            <div className="p-6 border-b border-cm-border bg-cm-cream/10">
              <h2 className="font-bold text-cm-text flex items-center gap-2">
                <FileText size={18} className="text-cm-green-mid" />
                Formulaire de demande
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-cm-text mb-3">Nombre de jours supplémentaires demandés</label>
                <div className="grid grid-cols-4 gap-3">
                  {[15, 30, 45, 60].map(days => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setRequestedDays(days)}
                      className={`py-3 rounded-xl font-bold text-sm transition-all border-2 ${
                        requestedDays === days 
                          ? 'border-cm-green-mid bg-cm-green-pale/10 text-cm-green-mid' 
                          : 'border-cm-border bg-white text-cm-muted hover:border-cm-green-pale'
                      }`}
                    >
                      +{days} j.
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-cm-muted mt-2">
                  Note: La durée totale cumulée (visa original + prorogation) ne peut excéder la limite légale de votre type de visa.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-cm-text mb-2">Motif de la prorogation <span className="text-cm-red">*</span></label>
                <textarea
                  required
                  rows={5}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-3 bg-cm-cream/30 border border-cm-border rounded-xl text-cm-text text-sm focus:border-cm-green-mid outline-none resize-none"
                  placeholder="Expliquez pourquoi vous avez besoin de plus de temps (affaires, santé, tourisme prolongé...)"
                />
              </div>

              <div className="bg-cm-gold-pale/10 border border-cm-gold/30 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle size={18} className="text-cm-gold mt-0.5 shrink-0" />
                <p className="text-xs text-cm-gold-dark font-medium leading-relaxed">
                  Votre demande sera soumise à l'approbation des autorités d'immigration. Des frais de dossier peuvent s'appliquer après la validation initiale de votre motif.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-cm-green-mid text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-cm-green transition-all shadow-lg shadow-cm-green/20 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Soumettre ma demande
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-cm-border p-6">
            <h3 className="font-bold text-cm-text text-sm uppercase tracking-wider mb-4">Visa Actuel</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-cm-muted uppercase">N° Demande</p>
                <p className="text-sm font-bold text-cm-text">{application?.application_number}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-cm-muted uppercase">Type de Visa</p>
                <p className="text-sm font-medium text-cm-text">{application?.visa_type?.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-cm-muted uppercase text-cm-red">Expire le</p>
                <p className="text-sm font-bold text-cm-red">
                   {application?.evisa?.expiry_date ? formatDate(application.evisa.expiry_date) : 'Non spécifié'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-cm-cream/30 rounded-3xl p-6 border border-dashed border-cm-border">
            <h3 className="font-bold text-cm-text text-sm mb-3">Besoin d'aide ?</h3>
            <p className="text-xs text-cm-muted leading-relaxed mb-4">
              Si vous rencontrez des difficultés pour soumettre votre demande, contactez notre support technique ou rendez-vous au bureau d'immigration le plus proche.
            </p>
            <Link to="/applicant/support" className="text-xs font-bold text-cm-green-mid hover:underline">
              Contacter le support →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
