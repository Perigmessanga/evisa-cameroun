import { useTranslation } from 'react-i18next';
import { Users, Plus, ChevronRight, UserCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface GroupMember {
  id: string;
  full_name: string;
  application_number: string;
  is_primary: boolean;
  status: string;
}

interface GroupWidgetProps {
  members: GroupMember[];
  groupReference: string | null;
}

export default function GroupWidget({ members, groupReference }: GroupWidgetProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCreateGroup = () => {
    // Générer une référence aléatoire FAM-XXXX
    const ref = 'FAM-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    // Aller au formulaire avec cette référence dans le state
    navigate('/applicant/application', { state: { groupReference: ref } });
  };

  if (!groupReference) {
    return (
      <div className="bg-cm-green/5 border border-cm-green-pale/30 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-cm-green/10 rounded-xl">
            <Users className="text-cm-green" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-cm-text">{t('group.title')}</h3>
            <p className="text-xs text-cm-muted">Voyagez-vous en famille ou en groupe ?</p>
          </div>
        </div>
        <p className="text-sm text-cm-text/70 mb-5 leading-relaxed">
          Liez vos demandes pour faciliter le traitement consulaire et suivre tout le monde en un coup d'œil.
        </p>
        <button 
          onClick={handleCreateGroup}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-cm-green text-cm-green rounded-xl font-bold text-sm hover:bg-cm-green hover:text-white transition-all shadow-xs"
        >
          <Plus size={18} /> Créer un groupe familial
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-cm-border rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-cm-border bg-cm-cream/20 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Users className="text-cm-gold" size={20} />
          <h3 className="font-bold text-cm-text text-sm">
            {t('group.title')} <span className="text-[10px] font-normal text-cm-muted ml-2">#{groupReference}</span>
          </h3>
        </div>
        <span className="text-[10px] font-bold text-cm-green bg-cm-green/10 px-2 py-0.5 rounded-full">
          {t('group.members_count', { count: members.length })}
        </span>
      </div>
      
      <div className="divide-y divide-cm-border">
        {members.map(member => (
          <div key={member.id} className="p-4 flex items-center justify-between hover:bg-cm-cream/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${member.is_primary ? 'bg-cm-gold/20 text-cm-gold' : 'bg-cm-cream text-cm-muted'}`}>
                <UserCircle size={18} />
              </div>
              <div>
                <div className="text-xs font-bold text-cm-text">{member.full_name}</div>
                <div className="text-[10px] text-cm-muted">{member.is_primary ? t('group.primary_applicant') : t('group.member')}</div>
              </div>
            </div>
            <Link to={`/applicant/tracking/${member.id}`} className="p-1.5 text-cm-muted hover:text-cm-green transition-colors">
              <ChevronRight size={16} />
            </Link>
          </div>
        ))}
      </div>

      <div className="p-4 bg-cm-cream/10">
        <Link 
          to="/applicant/application" 
          state={{ groupReference }}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-cm-green text-white rounded-xl font-bold text-xs hover:shadow-md transition-all active:scale-95"
        >
          <Plus size={14} /> {t('group.add_member')}
        </Link>
      </div>
    </div>
  );
}
