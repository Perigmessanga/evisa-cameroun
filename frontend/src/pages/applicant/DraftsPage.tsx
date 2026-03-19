// ─────────────────────────────────────────────
//  pages/applicant/DraftsPage.tsx
//  Affiche tous les brouillons sauvegardés comme Gmail
// ─────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Plus, ChevronRight, Trash2, Clock, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface Draft {
  draftId: string;
  visaType: string;
  firstName?: string;
  lastName?: string;
  nationality?: string;
  savedAt: string;
  stepReached: number;
  status: string;
}

const VISA_LABELS: Record<string, string> = {
  TOURISM_SHORT: 'Visa Tourisme — Court Séjour',
  TOURISM_LONG: 'Visa Tourisme — Long Séjour',
  BUSINESS_SHORT: 'Visa Affaires — Court Séjour',
  BUSINESS_LONG: 'Visa Affaires — Long Séjour',
  STUDENT: 'Visa Étudiant',
  TRANSIT: 'Visa Transit',
  DIPLOMATIC: 'Visa Diplomatique',
  HUMANITARIAN: 'Visa Humanitaire / ONG',
  CONFERENCE: 'Visa Conférence',
  JOURNALIST: 'Visa Journaliste',
  FAMILY: 'Visa Regroupement Familial',
};

const STEP_NAMES = ['Type de Visa', 'Infos Personnelles', 'Passeport & Voyage', 'Documents'];

export default function DraftsPage() {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState<Draft[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('evisa_all_drafts') || '[]');
    setDrafts(saved);
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const handleContinue = (draft: Draft) => {
    localStorage.setItem('evisa_draft', JSON.stringify(draft));
    navigate('/applicant/application');
  };

  const handleDelete = (draftId: string) => {
    const updated = drafts.filter(d => d.draftId !== draftId);
    setDrafts(updated);
    localStorage.setItem('evisa_all_drafts', JSON.stringify(updated));
    // Also remove current draft if it matches
    const current = JSON.parse(localStorage.getItem('evisa_draft') || '{}');
    if (current.draftId === draftId) localStorage.removeItem('evisa_draft');
    toast.success('Brouillon supprimé.');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-cm-muted text-sm mb-2">
            <ArrowLeft size={14} />
            <Link to="/applicant/dashboard" className="hover:text-cm-green transition-colors">Tableau de bord</Link>
          </div>
          <h1 className="font-display text-3xl font-bold text-cm-text">Mes Brouillons</h1>
          <p className="text-cm-muted mt-1">Retrouvez et continuez vos demandes enregistrées.</p>
        </div>
        <Link to="/applicant/application" className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-cm-green to-cm-green-mid text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
          <Plus size={18} /> Nouvelle Demande
        </Link>
      </div>

      {/* Drafts List */}
      {drafts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-cm-border p-16 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-cm-cream flex items-center justify-center mx-auto mb-4">
            <BookOpen size={32} className="text-cm-muted" />
          </div>
          <h2 className="font-display text-xl font-bold text-cm-text mb-2">Aucun brouillon</h2>
          <p className="text-cm-muted text-sm mb-6">Commencez une nouvelle demande et sauvegardez-la pour la retrouver ici.</p>
          <Link to="/applicant/application" className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-cm-green to-cm-green-mid text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all">
            <Plus size={16} /> Commencer une demande
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {drafts.map(draft => (
            <div key={draft.draftId} className="bg-white border border-cm-border rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-cm-gold-pale/20 border border-cm-gold/20 flex items-center justify-center shrink-0">
                  <BookOpen size={22} className="text-cm-gold" />
                </div>
                <div>
                  <h3 className="font-bold text-cm-text text-sm">
                    {VISA_LABELS[draft.visaType] || 'Demande sans type'}
                  </h3>
                  {(draft.firstName || draft.lastName) && (
                    <p className="text-sm text-cm-muted">
                      {draft.firstName} {draft.lastName}
                      {draft.nationality ? ` — ${draft.nationality}` : ''}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-cm-gold-pale/20 text-cm-gold rounded-md text-[10px] font-bold uppercase tracking-wider">
                      <Clock size={10} /> Brouillon
                    </span>
                    <span className="text-xs text-cm-muted">
                      Étape atteinte : <strong>{STEP_NAMES[draft.stepReached] || 'Type de Visa'}</strong>
                    </span>
                  </div>
                  <p className="text-[10px] text-cm-muted/60 mt-1 font-semibold uppercase tracking-wider">
                    Sauvegardé le {formatDate(draft.savedAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => handleDelete(draft.draftId)}
                  className="p-2 text-cm-red hover:bg-cm-red/5 rounded-xl transition-colors"
                  title="Supprimer ce brouillon"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={() => handleContinue(draft)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-cm-green to-cm-green-mid text-white rounded-xl font-bold text-sm hover:shadow-md transition-all"
                >
                  Continuer <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
