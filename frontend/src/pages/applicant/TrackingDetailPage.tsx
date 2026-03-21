// ─────────────────────────────────────────────
//  pages/applicant/TrackingDetailPage.tsx
// ─────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, FileWarning, Search, Calendar, MapPin, Download, Loader2 } from 'lucide-react';
import Badge from '../../components/common/Badge';
import applicationService from '../../services/applicationService';
import toast from 'react-hot-toast';

export default function TrackingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    applicationService.getApplication(id)
      .then(res => setApplication(res))
      .catch(() => toast.error('Erreur de chargement des détails.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 size={40} className="animate-spin text-cm-green-mid mb-4" />
        <p className="text-cm-muted font-medium">Chargement des informations...</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center animate-fadeIn">
        <Search size={48} className="text-cm-muted mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-cm-text">Demande introuvable</h2>
        <p className="text-cm-muted mt-2 mb-6">Nous ne trouvons pas la demande {id}.</p>
        <Link to="/applicant/tracking" className="text-cm-green-mid hover:underline">
          Retour au suivi
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return <Badge variant="success">Approuvée</Badge>;
      case 'IN_PROGRESS': return <Badge variant="warning">En cours</Badge>;
      case 'REJECTED': return <Badge variant="danger">Rejetée</Badge>;
      case 'SUBMITTED': return <Badge variant="warning">Soumise</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const timelineSteps = [
    { label: 'Soumission', done: true },
    { label: 'Paiement', done: true },
    { label: 'Traitement en cours', done: application.status === 'IN_PROGRESS' || application.status === 'APPROVED' },
    { label: 'Décision finale', done: application.status === 'APPROVED' || application.status === 'REJECTED' },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-cm-muted text-sm mb-4">
          <ArrowLeft size={14} />
          <Link to="/applicant/tracking" className="hover:text-cm-green transition-colors">Retour au suivi</Link>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
              <h1 className="font-display text-3xl font-bold text-cm-text flex items-center gap-3">
              Demande {application.application_number || application.id}
            </h1>
            <p className="text-cm-muted mt-1">{application.visa_type?.name || application.type}</p>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(application.status)}
            {application.status === 'APPROVED' && (
              <Link 
                to={`/applicant/download-visa/${application.id}`}
                className="flex items-center gap-2 px-4 py-2 bg-cm-green-pale/20 text-cm-green border border-cm-green/30 rounded-xl font-bold text-sm hover:bg-cm-green hover:text-white transition-colors"
              >
                <Download size={16} /> Télécharger
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-cm-border p-6 shadow-sm">
            <h2 className="text-xl font-bold text-cm-text mb-6">Récapitulatif de la demande</h2>
            
            <div className="grid sm:grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <div className="text-xs font-bold text-cm-muted mb-1 flex items-center gap-1"><Calendar size={14} /> DATE DE SOUMISSION</div>
                <div className="font-semibold text-cm-text">{application.submitted_at || application.created_at ? formatDate(application.submitted_at || application.created_at) : 'En attente'}</div>
              </div>
              {application.passport_expiry_date && (
                <div>
                  <div className="text-xs font-bold text-cm-muted mb-1 flex items-center gap-1"><Clock size={14} /> EXPIRATION PASSEPORT</div>
                  <div className="font-semibold text-cm-text">{formatDate(application.passport_expiry_date)}</div>
                </div>
              )}
              <div>
                <div className="text-xs font-bold text-cm-muted mb-1 flex items-center gap-1"><MapPin size={14} /> NATIONALITÉ</div>
                <div className="font-semibold text-cm-text">{application.nationality || application.country || 'Non spécifié'}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-cm-border p-6 shadow-sm">
            <h2 className="text-xl font-bold text-cm-text mb-6">Documents soumis</h2>
            <div className="space-y-3">
              {application.documents && application.documents.length > 0 ? (
                application.documents.map((doc: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-cm-border/50 rounded-xl bg-cm-cream/30">
                    <span className="text-sm font-semibold text-cm-text">
                      {doc.document_type || doc.file_name || `Document ${index + 1}`}
                    </span>
                    <CheckCircle2 size={16} className="text-cm-green-mid" />
                  </div>
                ))
              ) : (
                <div className="text-sm text-cm-muted italic">Aucun document rattaché.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Timeline */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-cm-border p-6 shadow-sm">
            <h2 className="font-bold text-cm-text mb-6">État d'avancement</h2>
            
            <div className="relative border-l-2 border-cm-border ml-3 space-y-8">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="relative pl-6">
                  {step.done ? (
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-cm-green-mid border-4 border-white" />
                  ) : (
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-cm-cream border-2 border-cm-border" />
                  )}
                  <h4 className={`text-sm font-bold ${step.done ? 'text-cm-text' : 'text-cm-muted'}`}>
                    {step.label}
                  </h4>
                  {step.done && idx === timelineSteps.length - 1 && application.status === 'APPROVED' && (
                    <p className="text-xs text-cm-green-mid mt-1 font-semibold">Visa délivré avec succès.</p>
                  )}
                  {step.done && idx === timelineSteps.length - 1 && application.status === 'REJECTED' && (
                    <p className="text-xs text-cm-red mt-1 font-semibold">Demande rejetée.</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
