import { useState, useEffect } from 'react';
import { 
  Mail, Search, CheckCircle2, MessageSquare, 
  Clock, Send, User, Reply, AlertCircle, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';

// Interfaces for Types
interface ContactMessage {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'REPLIED';
  created_at: string;
  reply_message?: string;
  replied_at?: string;
}

export default function MessagesManagementPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await adminService.getContactMessages();
      setMessages(data);
    } catch (error) {
       console.error(error);
       toast.error('Erreur lors du chargement des messages.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (message: ContactMessage) => {
    setSelectedMessage(message);
    setReplyText(message.reply_message || '');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
    setReplyText('');
  };

  const handleSendReply = async () => {
    if (!selectedMessage) return;
    if (!replyText.trim()) {
      toast.error('Le message de réponse ne peut être vide.');
      return;
    }

    try {
      setReplying(true);
      await adminService.replyContactMessage(selectedMessage.id, { reply_message: replyText });
      toast.success('Réponse envoyée avec succès.');
      handleCloseModal();
      fetchMessages(); // Refresh list
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'envoi de la réponse.");
    } finally {
      setReplying(false);
    }
  };

  // Filtering
  const filteredMessages = messages.filter(msg => {
    const matchesSearch = 
      msg.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'ALL') return matchesSearch;
    return matchesSearch && msg.status === filter;
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto pb-12">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-cm-text flex items-center gap-3">
            <Mail className="text-cm-green" size={32} /> Support & Messages
          </h1>
          <p className="text-cm-muted mt-1">Gérez les demandes de contact des utilisateurs de la plateforme.</p>
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div className="bg-white p-5 rounded-2xl border border-cm-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cm-muted" size={18} />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou sujet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-cm-cream/50 border border-cm-border rounded-xl text-sm outline-none focus:border-cm-green-mid"
          />
        </div>
        <div className="h-8 w-px bg-cm-border hidden md:block"></div>
        <div className="flex bg-cm-cream/50 p-1 rounded-xl border border-cm-border shrink-0">
          {['ALL', 'UNREAD', 'REPLIED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === f 
                  ? 'bg-white shadow-sm text-cm-text border border-cm-border/50' 
                  : 'text-cm-muted hover:text-cm-text'
              }`}
            >
              {f === 'ALL' ? 'Tous' : f === 'UNREAD' ? 'En attente' : 'Répondus'}
            </button>
          ))}
        </div>
      </div>

      {/* ── LIST ── */}
      <div className="bg-white rounded-2xl border border-cm-border shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex justify-center flex-col items-center h-64 text-cm-muted">
            <Loader2 className="animate-spin mb-4 text-cm-green" size={32} />
            <p>Chargement des messages...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="w-16 h-16 bg-cm-cream rounded-full flex items-center justify-center text-cm-muted mb-4">
              <MessageSquare size={32} />
            </div>
            <h3 className="font-display font-bold text-xl text-cm-text mb-2">Aucun message trouvé</h3>
            <p className="text-cm-muted max-w-md">Il n'y a pas de message correspondant à vos critères de recherche.</p>
          </div>
        ) : (
          <div className="divide-y divide-cm-border">
            {filteredMessages.map((msg) => (
              <div 
                key={msg.id} 
                onClick={() => handleOpenModal(msg)}
                className={`p-5 flex items-start gap-4 hover:bg-cm-cream/30 transition-colors cursor-pointer ${msg.status === 'UNREAD' ? 'bg-white' : 'bg-cm-cream/10'}`}
              >
                <div className="shrink-0">
                  {msg.status === 'REPLIED' ? (
                     <div className="w-10 h-10 rounded-full bg-cm-green-pale/20 text-cm-green flex flex-col items-center justify-center">
                       <CheckCircle2 size={18} />
                     </div>
                  ) : (
                     <div className="w-10 h-10 rounded-full bg-cm-gold-pale/20 text-cm-gold flex flex-col items-center justify-center">
                       <AlertCircle size={18} />
                     </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-cm-text truncate pr-4 ${msg.status === 'UNREAD' ? 'font-bold' : 'font-medium'}`}>
                      {msg.first_name} {msg.last_name}
                    </h4>
                    <span className="text-xs text-cm-muted shrink-0 flex items-center gap-1">
                      <Clock size={12} /> {new Date(msg.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className={`text-sm mb-1 truncate ${msg.status === 'UNREAD' ? 'font-bold text-cm-text' : 'font-medium text-cm-text'}`}>
                    {msg.subject}
                  </div>
                  <p className="text-sm text-cm-muted line-clamp-1">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── MODAL ── */}
      {isModalOpen && selectedMessage && (
        <div className="fixed inset-0 bg-cm-dark/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-scaleIn">
            
            <div className="p-6 border-b border-cm-border flex justify-between items-center bg-cm-cream/30">
              <h2 className="font-display font-bold text-xl text-cm-text flex items-center gap-2">
                <MessageSquare size={24} className="text-cm-green" /> Demande de Support
              </h2>
              <button onClick={handleCloseModal} className="text-cm-muted hover:text-cm-text p-2 bg-white rounded-full transition-colors">
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* User Info */}
              <div className="flex gap-4 p-4 bg-cm-cream/50 rounded-2xl border border-cm-border">
                <div className="w-12 h-12 bg-cm-green/10 text-cm-green rounded-full flex items-center justify-center shrink-0">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-cm-text">{selectedMessage.first_name} {selectedMessage.last_name}</h3>
                  <div className="text-sm text-cm-muted mb-1">{selectedMessage.email}</div>
                  <div className="text-xs font-semibold text-cm-green bg-cm-green-pale/20 inline-flex px-2 py-0.5 rounded">
                    Reçu le {new Date(selectedMessage.created_at).toLocaleString('fr-FR')}
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <h4 className="text-sm font-bold text-cm-muted uppercase mb-2">Objet : {selectedMessage.subject}</h4>
                <div className="p-4 bg-white border border-cm-border shadow-sm rounded-xl text-cm-text whitespace-pre-wrap leading-relaxed text-sm">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Reply Section */}
              <div className="border-t border-cm-border pt-6">
                <h4 className="text-sm font-bold text-cm-text flex items-center gap-2 mb-3">
                  <Reply size={16} className="text-cm-muted" /> Votre Réponse
                </h4>
                
                {selectedMessage.status === 'REPLIED' ? (
                  <div className="p-4 bg-cm-green-pale/10 border border-cm-green/30 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-xs font-bold text-cm-green bg-cm-green/10 px-2 py-1 rounded flex items-center gap-1">
                          <CheckCircle2 size={12} /> Répondu le {new Date(selectedMessage.replied_at || '').toLocaleString('fr-FR')}
                       </span>
                    </div>
                    <div className="text-cm-text text-sm whitespace-pre-wrap">{selectedMessage.reply_message}</div>
                  </div>
                ) : (
                  <div>
                    <textarea 
                      rows={6}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Saisissez votre réponse ici. Elle sera envoyée par email à l'utilisateur..."
                      className="w-full p-4 bg-cm-cream/30 border border-cm-border rounded-xl focus:border-cm-green-mid outline-none transition-colors text-sm resize-none mb-4"
                    ></textarea>
                    
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={handleCloseModal}
                        className="px-5 py-2.5 rounded-xl text-cm-muted hover:text-cm-text font-bold text-sm bg-cm-cream transition-colors"
                      >
                        Annuler
                      </button>
                      <button 
                        onClick={handleSendReply}
                        disabled={replying}
                        className="flex items-center gap-2 px-6 py-2.5 bg-cm-green text-white rounded-xl font-bold text-sm hover:bg-cm-green-mid shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {replying ? <Loader2 size={18} className="animate-spin" /> : <><Send size={18} /> Envoyer la réponse</>}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
