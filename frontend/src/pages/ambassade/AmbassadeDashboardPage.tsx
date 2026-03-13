// ─────────────────────────────────────────────
//  pages/ambassade/AmbassadeDashboardPage.tsx
// ─────────────────────────────────────────────
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { mockAmbassadeStats, mockDossiers, mockMessages } from '../../data/mockAmbassadeData';
import { 
  Building2, MessageSquare, Clock, ArrowRight,
  FolderOpen, AlertCircle, FileText
} from 'lucide-react';
import Badge from '../../components/common/Badge';

export default function AmbassadeDashboardPage() {
  const { user } = useAuth();
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT': return <Badge variant="danger">Urgent</Badge>;
      case 'HIGH': return <Badge variant="warning">Élevée</Badge>;
      case 'NORMAL': return <Badge variant="default">Normale</Badge>;
      default: return <Badge>{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'WAITING_EMBASSY': return <Badge variant="warning">Avis Requis</Badge>;
      case 'EMBASSY_APPROVED': return <Badge variant="success">Favorable</Badge>;
      case 'EMBASSY_REJECTED': return <Badge variant="danger">Défavorable</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short'
    });
  };

  const pendingDossiers = mockDossiers.filter(d => d.status === 'WAITING_EMBASSY').slice(0, 4);
  const unreadMessages = mockMessages.filter(m => !m.isRead).slice(0, 3);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white p-6 rounded-2xl border border-cm-border shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-cm-gold-pale to-cm-gold text-white flex items-center justify-center font-display font-bold text-2xl shadow-inner shrink-0">
             <Building2 size={28} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-cm-text">Portail Consulaire</h1>
            <p className="text-cm-muted mt-0.5 font-semibold">
              Ambassade du Cameroun - Paris (France)
            </p>
            <p className="text-sm text-cm-muted flex items-center gap-2 mt-1">
               Connecté en tant que: <span className="font-bold text-cm-text">{user?.first_name} {user?.last_name}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-cm-gold-pale/10 border border-cm-border rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
           <div className="w-14 h-14 rounded-full bg-cm-gold/20 flex items-center justify-center text-cm-gold shrink-0">
              <AlertCircle size={28} />
           </div>
           <div>
              <p className="text-sm font-bold text-cm-gold uppercase mb-1">Avis Requis</p>
              <h3 className="font-display text-3xl font-bold text-cm-text">{mockAmbassadeStats.pendingDossiers}</h3>
           </div>
        </div>
        
        <div className="bg-white border border-cm-border rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
           <div className="w-14 h-14 rounded-full bg-cm-green-pale/20 flex items-center justify-center text-cm-green-mid shrink-0">
              <FolderOpen size={28} />
           </div>
           <div>
              <p className="text-sm font-bold text-cm-muted uppercase mb-1">Traités (Mois)</p>
              <h3 className="font-display text-3xl font-bold text-cm-text">{mockAmbassadeStats.processedThisMonth}</h3>
           </div>
        </div>

        <div className="bg-white border border-cm-border rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4">
           <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
              <Clock size={28} />
           </div>
           <div>
              <p className="text-sm font-bold text-cm-muted uppercase mb-1">Temps Moyen</p>
              <h3 className="font-display text-2xl font-bold text-cm-text mt-1">{mockAmbassadeStats.averageProcessingTime}</h3>
           </div>
        </div>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* PENDING DOSSIERS */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-display text-xl font-bold text-cm-text flex items-center gap-2">
               <FileText className="text-cm-gold" size={20} /> Dossiers en Attente d'Avis
            </h2>
            <Link to="/ambassade/dossiers" className="text-sm font-bold text-cm-green-mid hover:text-cm-green transition-colors flex items-center gap-1">
              Voir tout ({mockAmbassadeStats.pendingDossiers}) <ArrowRight size={16} />
            </Link>
          </div>

          <div className="bg-white border border-cm-border rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
             {pendingDossiers.length > 0 ? (
               <div className="divide-y divide-cm-border/50">
                 {pendingDossiers.map(dossier => (
                   <Link key={dossier.id} to={`/ambassade/dossiers/${dossier.id}`} className="block p-4 sm:p-5 hover:bg-cm-cream/20 transition-colors group">
                     <div className="flex justify-between items-start gap-4 mb-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                           <span className="font-mono text-xs font-bold text-cm-muted">{dossier.id}</span>
                           {getPriorityBadge(dossier.priority)}
                        </div>
                        <span className="text-xs font-bold text-cm-muted">{formatDate(dossier.submissionDate)}</span>
                     </div>
                     <div className="flex justify-between items-end gap-4 mt-2">
                        <div>
                           <h3 className="font-bold text-cm-text group-hover:text-cm-green-mid transition-colors">{dossier.applicantName}</h3>
                           <p className="text-sm text-cm-muted">Nat: {dossier.nationality} • Type: {dossier.type}</p>
                        </div>
                        {getStatusBadge(dossier.status)}
                     </div>
                   </Link>
                 ))}
               </div>
             ) : (
                <div className="p-8 text-center text-cm-muted">
                   Aucun dossier en attente d'avis consulaire.
                </div>
             )}
          </div>
        </div>

        {/* MESSAGERIE WIDGET */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-display text-xl font-bold text-cm-text flex items-center gap-2">
               <MessageSquare className="text-blue-500" size={20} /> Messagerie
            </h2>
            <Link to="/ambassade/messagerie" className="text-sm font-bold text-cm-green-mid hover:text-cm-green transition-colors flex items-center gap-1">
              {mockAmbassadeStats.messagesUnread > 0 && (
                 <span className="w-5 h-5 rounded-full bg-cm-red text-white text-[10px] flex items-center justify-center mr-1">
                    {mockAmbassadeStats.messagesUnread}
                 </span>
              )}
              Ouvrir
            </Link>
          </div>

          <div className="bg-white border border-cm-border rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
             {unreadMessages.length > 0 ? (
                <div className="divide-y divide-cm-border/50">
                  {unreadMessages.map(msg => (
                    <Link key={msg.id} to="/ambassade/messagerie" className="block p-4 hover:bg-cm-cream/20 transition-colors bg-blue-50/30">
                      <div className="flex justify-between items-start mb-1">
                         <span className="font-bold text-sm text-cm-text">{msg.from}</span>
                         <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5"></span>
                      </div>
                      <p className="text-sm text-cm-muted line-clamp-2">{msg.subject}</p>
                      <p className="text-[10px] text-cm-muted/70 font-bold mt-2 uppercase">{formatDate(msg.date)}</p>
                    </Link>
                  ))}
                </div>
             ) : (
                <div className="p-6 text-center text-cm-muted text-sm border-t border-cm-border">
                   Aucun nouveau message.
                </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
}
