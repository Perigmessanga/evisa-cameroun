// ─────────────────────────────────────────────
//  pages/ambassade/MessageriePage.tsx
// ─────────────────────────────────────────────
import { useState } from 'react';
import { mockMessages } from '../../data/mockAmbassadeData';
import { 
  MessageSquare, Search, Send, FileText, 
  MoreVertical, Clock, CheckCheck
} from 'lucide-react';

export default function MessageriePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<number | null>(mockMessages[0]?.id || null);
  const [replyText, setReplyText] = useState('');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  const activeMessage = mockMessages.find(m => m.id === selectedMessage);

  return (
    <div className="h-[calc(100vh-140px)] min-h-[600px] flex flex-col pt-4 animate-fadeIn">
      
      {/* ── HEADER ── */}
      <div className="mb-6">
         <h1 className="font-display text-3xl font-bold text-cm-text flex items-center gap-3">
           <MessageSquare className="text-blue-500" size={32} /> Messagerie Interne
         </h1>
         <p className="text-cm-muted mt-1">Échangez de manière sécurisée avec les agents de la DGSN concernant les dossiers.</p>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-cm-border overflow-hidden flex flex-col md:flex-row">
         
         {/* ── SIDEBAR (MESSAGE LIST) ── */}
         <div className="w-full md:w-80 border-r border-cm-border flex flex-col bg-cm-cream/20">
            <div className="p-4 border-b border-cm-border">
               <div className="relative">
                 <input 
                   type="text" 
                   placeholder="Rechercher..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-9 pr-4 py-2 bg-white border border-cm-border rounded-lg text-sm focus:border-cm-green-mid outline-none" 
                 />
                 <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cm-muted" />
               </div>
            </div>
            <div className="flex-1 overflow-y-auto">
               {mockMessages.map(msg => (
                  <button 
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg.id)}
                    className={`w-full text-left p-4 border-b border-cm-border/50 hover:bg-cm-cream transition-colors ${
                       selectedMessage === msg.id ? 'bg-cm-cream border-l-4 border-l-cm-green-mid' : 'border-l-4 border-l-transparent'
                    }`}
                  >
                     <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm ${msg.isRead ? 'text-cm-text font-semibold' : 'text-cm-text font-bold'}`}>{msg.from}</span>
                        {!msg.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1"></span>}
                     </div>
                     <p className={`text-xs line-clamp-2 mb-2 ${msg.isRead ? 'text-cm-muted' : 'text-cm-text font-semibold'}`}>{msg.subject}</p>
                     <p className="text-[10px] text-cm-muted/80 font-bold uppercase">{formatDate(msg.date)}</p>
                  </button>
               ))}
            </div>
         </div>

         {/* ── CHAT VIEW ── */}
         {activeMessage ? (
            <div className="flex-1 flex flex-col">
               {/* View Header */}
               <div className="p-4 sm:p-6 border-b border-cm-border flex justify-between items-center bg-white shadow-sm z-10">
                  <div>
                     <h2 className="font-bold text-lg text-cm-text">{activeMessage.subject}</h2>
                     <p className="text-sm font-semibold text-cm-muted flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 rounded-full bg-cm-green-mid"></span> En ligne • {activeMessage.from}
                     </p>
                  </div>
                  <button className="p-2 text-cm-muted hover:bg-cm-cream rounded-lg transition-colors"><MoreVertical size={20}/></button>
               </div>

               {/* Messages Area */}
               <div className="flex-1 p-6 overflow-y-auto bg-cm-cream/10 space-y-6">
                  
                  {/* Incoming context message */}
                  <div className="flex gap-4 max-w-2xl">
                     <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">{activeMessage.from[0]}</div>
                     <div>
                        <div className="bg-white p-4 rounded-b-xl rounded-tr-xl border border-cm-border shadow-sm text-sm text-cm-text whitespace-pre-wrap">
                           Bonjour l'Ambassade,<br/><br/>
                           Nous requérons un avis consulaire en urgence sur le dossier mentionné en objet. Le motif nous semble suspect par rapport au profil du demandeur.<br/><br/>
                           Merci pour votre retour rapide.
                        </div>
                        <p className="text-[10px] text-cm-muted font-bold uppercase mt-1.5 flex items-center gap-1">
                           <Clock size={10} /> {formatDate(activeMessage.date)}
                        </p>
                     </div>
                  </div>

                  {/* Attachment if any */}
                  {activeMessage.subject.includes('VA-') && (
                     <div className="flex gap-4 max-w-2xl ml-14">
                        <div className="flex items-center gap-3 p-3 bg-white border border-cm-border rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer w-64">
                           <div className="w-10 h-10 rounded-lg bg-cm-red/5 flex items-center justify-center text-cm-red shrink-0"><FileText size={20}/></div>
                           <div className="overflow-hidden">
                              <p className="text-xs font-bold text-cm-text truncate">Dossier_{activeMessage.subject.split(' ')[activeMessage.subject.split(' ').length - 1]}.pdf</p>
                              <p className="text-[10px] text-cm-muted">2.4 MB</p>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* Outgoing Message Placeholder Example */}
                  {activeMessage.isRead && (
                    <div className="flex gap-4 max-w-2xl ml-auto flex-row-reverse">
                       <div className="w-10 h-10 rounded-full bg-cm-gold-pale/30 text-cm-gold flex items-center justify-center font-bold text-xs shrink-0">AMB</div>
                       <div>
                          <div className="bg-cm-green-pale/10 p-4 rounded-b-xl rounded-tl-xl border border-cm-green-pale/30 shadow-sm text-sm text-cm-text whitespace-pre-wrap">
                             Bien noté. Nous analysons le dossier et revenons vers vous dans l'heure.
                          </div>
                          <p className="text-[10px] text-cm-muted font-bold uppercase mt-1.5 flex justify-end items-center gap-1">
                             <CheckCheck size={12} className="text-cm-green-mid" /> 11:35
                          </p>
                       </div>
                    </div>
                  )}

               </div>

               {/* Reply Input */}
               <div className="p-4 border-t border-cm-border bg-white">
                  <div className="bg-cm-cream/50 border border-cm-border rounded-2xl flex items-end p-2 focus-within:border-cm-green-mid focus-within:ring-4 focus-within:ring-cm-green/5 transition-all">
                     <textarea 
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Écrivez votre réponse..."
                        className="flex-1 bg-transparent max-h-32 min-h-[44px] p-3 outline-none text-sm resize-none"
                        rows={1}
                     />
                     <button className={`p-3 rounded-xl flex items-center justify-center mb-1 mr-1 transition-all ${
                        replyText.trim() ? 'bg-cm-green-mid text-white hover:bg-cm-green hover:shadow-md cursor-pointer' : 'bg-cm-border text-cm-muted cursor-not-allowed'
                     }`}>
                        <Send size={18} />
                     </button>
                  </div>
               </div>
            </div>
         ) : (
            <div className="flex-1 flex items-center justify-center bg-cm-cream/20">
               <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white border border-cm-border flex items-center justify-center mx-auto mb-4 text-cm-muted">
                     <MessageSquare size={24} />
                  </div>
                  <h3 className="font-bold text-cm-text text-lg">Aucun message sélectionné</h3>
                  <p className="text-sm text-cm-muted mt-1">Sélectionnez une conversation pour l'afficher.</p>
               </div>
            </div>
         )}
      
      </div>
    </div>
  );
}
