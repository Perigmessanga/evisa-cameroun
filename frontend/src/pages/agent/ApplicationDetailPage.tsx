// ─────────────────────────────────────────────
//  pages/agent/ApplicationDetailPage.tsx
// ─────────────────────────────────────────────
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockAgentApplications } from '../../data/mockAgentData';
import Badge from '../../components/common/Badge';
import { 
  ArrowLeft, CheckCircle2, XCircle, AlertCircle, 
  MapPin, Calendar, FileText, Download, User as UserIcon, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Find application or use fallback
  const app = mockAgentApplications.find(a => a.id === id) || mockAgentApplications[0];

  const handleAction = (action: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(`Dossier ${id} ${action} avec succès.`);
      navigate('/agent/applications');
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return <Badge variant="success">Approuvé</Badge>;
      case 'PENDING': return <Badge variant="info">Nouveau</Badge>;
      case 'IN_PROGRESS': return <Badge variant="warning">En cours</Badge>;
      case 'REJECTED': return <Badge variant="danger">Rejeté</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

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
        <div>
          <h1 className="font-display text-3xl font-bold text-cm-text flex items-center gap-3">
            Dossier {app.id}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            {getStatusBadge(app.status)}
            <span className="text-sm font-medium text-cm-muted">Soumis le {new Date(app.submissionDate).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => handleAction('rejeté')}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-cm-red text-cm-red rounded-xl font-bold text-sm hover:bg-cm-red/5 transition-colors disabled:opacity-50"
          >
            <XCircle size={18} /> Rejeter
          </button>
          <button 
            onClick={() => handleAction('mis en attente')}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-cm-gold text-cm-gold rounded-xl font-bold text-sm hover:bg-cm-gold/5 transition-colors disabled:opacity-50"
          >
            <AlertCircle size={18} /> Docs Requis
          </button>
          <button 
            onClick={() => handleAction('approuvé')}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-cm-green to-cm-green-mid text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <><CheckCircle2 size={18} /> Approuver</>}
          </button>
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
                <p className="font-medium text-cm-text">{app.applicantName}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-cm-muted uppercase tracking-wider mb-1">Date de naissance</p>
                <p className="font-medium text-cm-text">15 Jui 1985 (38 ans)</p>
              </div>
              <div>
                <p className="text-xs font-bold text-cm-muted uppercase tracking-wider mb-1">Nationalité</p>
                <p className="font-medium text-cm-text flex items-center gap-2">
                  <MapPin size={14} className="text-cm-muted" /> {app.nationality}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-cm-muted uppercase tracking-wider mb-1">Profession</p>
                <p className="font-medium text-cm-text">Ingénieur Logiciel</p>
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
                <p className="font-mono font-medium text-cm-text">14XY89221</p>
              </div>
              <div>
                <p className="text-xs font-bold text-cm-muted uppercase tracking-wider mb-1">Expiration Passeport</p>
                <p className="font-medium text-cm-text">20 Nov 2028</p>
              </div>
              <div>
                <p className="text-xs font-bold text-cm-muted uppercase tracking-wider mb-1">Arrivée Prévue</p>
                <p className="font-medium text-cm-text flex items-center gap-2">
                  <Calendar size={14} className="text-cm-muted" /> 10 Avr 2024
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-cm-muted uppercase tracking-wider mb-1">Lieu de séjour</p>
                <p className="font-medium text-cm-text text-sm leading-relaxed">Hôtel Hilton Yaoundé<br/>20 Bvd 20 Mai, Yaoundé</p>
              </div>
            </div>
          </div>

          {/* Section 3: Attached Documents */}
          <div className="bg-white rounded-2xl border border-cm-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-6 py-4 border-b border-cm-border bg-cm-cream/30 flex items-center gap-2">
              <FileText size={18} className="text-cm-green-mid" />
              <h2 className="font-bold text-cm-text">Documents Fournis</h2>
            </div>
            <ul className="divide-y divide-cm-border">
              {[
                { name: 'Passeport (Page Bio)', status: 'Validé' },
                { name: 'Photo d\'identité', status: 'Validé' },
                { name: 'Billet d\'avion aller-retour', status: 'À vérifier' },
                { name: 'Réservation d\'hôtel', status: 'À vérifier' }
              ].map((doc, i) => (
                <li key={i} className="p-4 flex items-center justify-between hover:bg-cm-cream/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cm-cream rounded-lg text-cm-muted">
                      <FileText size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-cm-text">{doc.name}</p>
                      <p className="text-xs font-medium text-cm-muted">PDF • 1.2 MB</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded ${doc.status === 'Validé' ? 'bg-cm-green-pale/20 text-cm-green-mid' : 'bg-cm-gold/10 text-cm-gold'}`}>
                      {doc.status}
                    </span>
                    <button className="p-2 text-cm-muted hover:text-cm-green-mid transition-colors bg-white border border-cm-border rounded-lg shadow-sm">
                      <Download size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ── SIDEBAR (Right Col) ── */}
        <div className="space-y-6">
          
          {/* Quick Info Box */}
          <div className="bg-cm-cream border border-cm-border rounded-2xl p-6">
            <h3 className="font-bold text-cm-text mb-4">Résumé de Demande</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-cm-muted">Type Visa</span>
                <span className="font-bold text-cm-text">{app.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cm-muted">Entrées</span>
                <span className="font-bold text-cm-text">Multiple</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cm-muted">Durée Souhaitée</span>
                <span className="font-bold text-cm-text">90 Jours</span>
              </div>
              <div className="pt-3 border-t border-cm-border/50 flex justify-between">
                <span className="text-cm-muted">Paiement</span>
                <span className="font-bold text-cm-green-mid flex items-center gap-1"><CheckCircle2 size={14} /> Réglé</span>
              </div>
            </div>
          </div>

          {/* Comment Box */}
          <div className="bg-white border border-cm-border rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <h3 className="font-bold text-cm-text mb-4">Notes Internes (Agent)</h3>
            <textarea 
              rows={4}
              placeholder="Ajouter une note ou justifier un rejet..."
              className="w-full p-3 bg-cm-cream/50 border border-cm-border rounded-xl text-sm focus:border-cm-green-mid outline-none resize-none mb-3"
            />
            <button className="w-full py-2 bg-cm-cream text-cm-text font-bold text-sm rounded-xl border border-cm-border hover:bg-cm-border/50 transition-colors">
              Enregistrer la note
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
