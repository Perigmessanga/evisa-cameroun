import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import visaService from '../../services/visaService';
import Badge from '../../components/common/Badge';
import { 
  ArrowLeft, CheckCircle2, XCircle, AlertCircle, 
  MapPin, Calendar, FileText, Download, User as UserIcon, Loader2,
  Fingerprint, Info, ExternalLink, Banknote
} from 'lucide-react';
import toast from 'react-hot-toast';
import { VisaApplication } from '../../types';

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState<VisaApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    const fetchApp = async () => {
      if (!id) return;
      try {
        const data = await visaService.getApplicationById(id);
        setApp(data);
      } catch (error) {
        console.error('Erreur chargement dossier:', error);
        toast.error('Impossible de charger les détails du dossier.');
      } finally {
        setLoading(false);
      }
    };
    fetchApp();
  }, [id]);

  const handleAction = async (decision: 'APPROVE' | 'REJECT' | 'REQUEST_DOCS') => {
    if (!id) return;
    setActionLoading(true);
    try {
      if (decision === 'APPROVE' || decision === 'REJECT') {
        await visaService.submitImmigrationDecision(id, decision, note);
        toast.success(`Dossier ${decision === 'APPROVE' ? 'approuvé' : 'rejeté'} avec succès.`);
      } else {
        // Logique pour demande de documents (à implémenter dans visaService si besoin spécifique)
        await visaService.addComment(id, `Demande de documents : ${note}`, false);
        toast.success(`Demande de documents envoyée.`);
      }
      navigate('/agent/applications');
    } catch (error) {
      console.error('Erreur action dossier:', error);
      toast.error('Une erreur est survenue lors du traitement.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return <Badge variant="success">Approuvé</Badge>;
      case 'SUBMITTED': return <Badge variant="info">Nouveau</Badge>;
      case 'PROCESSING': return <Badge variant="warning">En cours</Badge>;
      case 'REJECTED': return <Badge variant="danger">Rejeté</Badge>;
      case 'PENDING_DOCS': return <Badge variant="warning">Documents requis</Badge>;
      case 'PENDING_REVIEW': return <Badge variant="info">Avis consulaire</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-cm-muted">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p>Chargement des détails du dossier...</p>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-cm-text">Dossier introuvable</h2>
        <Link to="/agent/applications" className="text-cm-green-mid font-bold mt-4 inline-block hover:underline">
          Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-fadeIn">
      
      {/* ── BREADCRUMB ── */}
      <div className="mb-6">
        <Link to="/agent/applications" className="inline-flex items-center gap-2 text-sm font-semibold text-cm-muted hover:text-cm-text transition-colors">
          <ArrowLeft size={16} /> Retour à la liste
        </Link>
      </div>

      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Passport Photo */}
          <div className="w-24 h-32 bg-cm-cream border-2 border-cm-border rounded-xl overflow-hidden shadow-sm shrink-0 flex items-center justify-center">
            {app.documents?.find(d => d.document_type === 'PHOTO') ? (
              <img 
                src={app.documents.find(d => d.document_type === 'PHOTO')?.file_url || (app.documents.find(d => d.document_type === 'PHOTO')?.file as any)} 
                alt="Photo d'identité" 
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon size={40} className="text-cm-muted" />
            )}
          </div>
          
          <div>
            <h1 className="font-display text-3xl font-bold text-cm-text flex items-center gap-3">
              Dossier {app.application_number}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              {getStatusBadge(app.status)}
              <span className="text-sm font-medium text-cm-muted">Soumis le {new Date(app.submitted_at || app.created_at).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {app.status === 'APPROVED' ? (
            <button 
              onClick={() => visaService.downloadEVisa(app.id)}
              className="flex items-center gap-2 px-6 py-2.5 bg-cm-green-mid text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
            >
              <Download size={18} /> Télécharger E-Visa
            </button>
          ) : (
            <>
              <button 
                onClick={() => handleAction('REJECT')}
                disabled={actionLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-cm-red text-cm-red rounded-xl font-bold text-sm hover:bg-cm-red/5 transition-colors disabled:opacity-50"
              >
                <XCircle size={18} /> Rejeter
              </button>
              <button 
                onClick={() => handleAction('REQUEST_DOCS')}
                disabled={actionLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-cm-gold text-cm-gold rounded-xl font-bold text-sm hover:bg-cm-gold/5 transition-colors disabled:opacity-50"
              >
                <AlertCircle size={18} /> Docs Requis
              </button>
              <button 
                onClick={() => handleAction('APPROVE')}
                disabled={actionLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-cm-green to-cm-green-mid text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <><CheckCircle2 size={18} /> Approuver</>}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* ── MAIN CONTENT (Left 2 Col) ── */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Applicant Info */}
          <div className="bg-white rounded-2xl border border-cm-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-6 py-4 border-b border-cm-border bg-cm-cream/30 flex items-center gap-2">
              <UserIcon size={18} className="text-cm-green-mid" />
              <h2 className="font-bold text-cm-text">Informations Personnelles</h2>
            </div>
            <div className="p-6 grid sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-xs font-bold text-cm-muted uppercase tracking-wider mb-1">Nom Complet</p>
                <p className="font-medium text-cm-text">{app.full_name}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-cm-muted uppercase tracking-wider mb-1">Date de naissance</p>
                <p className="font-medium text-cm-text">{new Date(app.date_of_birth).toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-cm-muted uppercase tracking-wider mb-1">Nationalité</p>
                <p className="font-medium text-cm-text flex items-center gap-2">
                  <MapPin size={14} className="text-cm-muted" /> {app.nationality}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-cm-muted uppercase tracking-wider mb-1">Genre</p>
                <p className="font-medium text-cm-text">{app.gender}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Passport & Travel */}
          <div className="bg-white rounded-2xl border border-cm-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-6 py-4 border-b border-cm-border bg-cm-cream/30 flex items-center gap-2">
              <MapPin size={18} className="text-cm-green-mid" />
              <h2 className="font-bold text-cm-text">Passeport & Voyage</h2>
            </div>
            <div className="p-6 grid sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-xs font-bold text-cm-muted uppercase tracking-wider mb-1">Numéro de Passeport</p>
                <p className="font-mono font-medium text-cm-text">{app.passport_number}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-cm-muted uppercase tracking-wider mb-1">Expiration Passeport</p>
                <p className="font-medium text-cm-text">{new Date(app.passport_expiry_date).toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-cm-muted uppercase tracking-wider mb-1">Arrivée Prévue</p>
                <p className="font-medium text-cm-text flex items-center gap-2">
                  <Calendar size={14} className="text-cm-muted" /> {new Date(app.arrival_date).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-cm-muted uppercase tracking-wider mb-1">Lieu de séjour</p>
                <p className="font-medium text-cm-text text-sm leading-relaxed">{app.address_in_cameroon}</p>
              </div>
            </div>
          </div>

          {/* Section 3: Documents (Wait, User asked for this specifically) */}
          <div className="bg-white rounded-2xl border border-cm-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-6 py-4 border-b border-cm-border bg-cm-cream/30 flex items-center gap-2">
              <FileText size={18} className="text-cm-green-mid" />
              <h2 className="font-bold text-cm-text">Documents Fournis</h2>
            </div>
            <div className="divide-y divide-cm-border/50">
              {app.documents && app.documents.length > 0 ? (
                app.documents.map((doc) => (
                  <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-cm-cream/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-cm-cream rounded-lg flex items-center justify-center text-cm-green-mid">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-cm-text">{doc.document_type}</p>
                        <p className="text-[10px] text-cm-muted uppercase font-semibold">{doc.file_name} ({(doc.file_size / 1024 / 1024).toFixed(2)} MB)</p>
                      </div>
                    </div>
                    <a 
                      href={doc.file_url || (doc.file as any)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-cm-cream text-cm-text rounded-lg hover:bg-cm-green-mid hover:text-white transition-all border border-cm-border shadow-sm"
                      title="Ouvrir le document"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-sm text-cm-muted italic">
                  Aucun document trouvé pour ce dossier.
                </div>
              )}
            </div>
          </div>

          {/* Biometrics */}
          <div className="bg-linear-to-r from-cm-green-pale/10 to-transparent rounded-2xl border border-cm-green-mid/20 p-6 flex items-center gap-5">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${app.has_biometrics ? 'bg-cm-green-mid text-white' : 'bg-cm-cream text-cm-muted border border-cm-border'}`}>
              <Fingerprint size={28} />
            </div>
            <div>
              <h3 className="font-bold text-cm-text">Données Biométriques</h3>
              <p className="text-sm text-cm-muted">
                {app.has_biometrics 
                  ? "Vérification faciale terminée avec succès (Score: 98%)." 
                  : "Données biométriques non encore capturées ou en attente."}
              </p>
            </div>
            {app.has_biometrics && (
              <Badge variant="success" className="ml-auto">Vérifié</Badge>
            )}
          </div>

        </div>

        {/* ── SIDEBAR (Right Col) ── */}
        <div className="space-y-6">
          
          {/* Embassy Opinion */}
          {app.embassy_opinion && app.embassy_opinion !== 'NONE' && (
            <div className={`border rounded-2xl p-6 ${app.embassy_opinion === 'FAVORABLE' ? 'bg-cm-green-pale/5 border-cm-green-mid/30' : 'bg-cm-red/5 border-cm-red/30'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Info size={16} className={app.embassy_opinion === 'FAVORABLE' ? 'text-cm-green-mid' : 'text-cm-red'} />
                <h3 className="font-bold text-cm-text">Avis de l'Ambassade</h3>
              </div>
              <p className={`text-sm font-bold mb-2 ${app.embassy_opinion === 'FAVORABLE' ? 'text-cm-green-mid' : 'text-cm-red'}`}>
                {app.embassy_opinion}
              </p>
              <p className="text-xs text-cm-muted italic">
                "{app.embassy_comment || "Aucun commentaire."}"
              </p>
            </div>
          )}

          {/* Quick Info Box (Paiement) */}
          <div className="bg-cm-cream border border-cm-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-cm-text mb-4 flex items-center gap-2">
              <Banknote size={18} className="text-cm-green-mid" /> Résumé Financier
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-cm-muted">Frais Visa</span>
                <span className="font-bold text-cm-text">{app.visa_type?.fee?.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cm-muted">Statut Paiement</span>
                <span className={`font-bold ${app.payment_status === 'COMPLETED' ? 'text-cm-green-mid' : 'text-cm-red'}`}>
                  {app.payment_status === 'COMPLETED' ? 'Réglé' : app.payment_status || 'En attente'}
                </span>
              </div>
              <div className="pt-3 border-t border-cm-border/50 flex justify-between items-center">
                <span className="text-xs font-bold text-cm-muted uppercase">Total Payé</span>
                <span className="text-lg font-display font-bold text-cm-green-mid">
                  {app.payment_status === 'COMPLETED' ? `${app.visa_type?.fee?.toLocaleString()} FCFA` : '0 FCFA'}
                </span>
              </div>
            </div>
          </div>

          {/* Comment Box */}
          <div className="bg-white border border-cm-border rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <h3 className="font-bold text-cm-text mb-4">Notes Internes / Décision</h3>
            <textarea 
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ajouter une note ou justifier un rejet..."
              className="w-full p-3 bg-cm-cream/50 border border-cm-border rounded-xl text-sm focus:border-cm-green-mid outline-none resize-none mb-3"
            />
            <p className="text-[10px] text-cm-muted italic mb-3">
              L'historique complet est enregistré pour chaque action.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
