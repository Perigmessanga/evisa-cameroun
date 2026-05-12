// ─────────────────────────────────────────────
//  components/layout/DashboardLayout.tsx
// ─────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import visaService from '../../services/visaService';
import CameroonFlag from '../common/CameroonFlag';
import LanguageSwitcher from '../common/LanguageSwitcher';
import Footer from './Footer';
import { 
  LogOut, Menu, X, Home, FileText, Settings, User, 
  MapPin, ShieldCheck, ShieldAlert, Mail, Users, FileWarning, BarChart, BookOpen, Plus, RefreshCcw
} from 'lucide-react';

export default function DashboardLayout({ children }: { children?: React.ReactNode }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newComplementsCount, setNewComplementsCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const fetchStats = async () => {
      if (user && (user.role === 'AGENT' || user.role === 'EMBASSY' || user.role === 'ADMIN')) {
        try {
          const stats = await visaService.getImmigrationStats();
          if (stats && stats.newComplementsCount !== undefined) {
            setNewComplementsCount(stats.newComplementsCount);
          }
        } catch (error) {
          console.error('Erreur stats sidebar:', error);
        }
      }
    };
    fetchStats();
    // Refresh every 5 minutes
    const interval = setInterval(fetchStats, 300000);
    return () => clearInterval(interval);
  }, [user]);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Navigation config based on role
  const getNavItems = () => {
    switch (user.role) {
      case 'APPLICANT':
        return [
          { name: t('nav.dashboard'), path: '/applicant/dashboard', icon: <Home size={20} /> },
          { name: t('nav.apply'), path: '/applicant/application', icon: <Plus size={20} /> },
          { name: t('nav.tracking'), path: '/applicant/tracking', icon: <FileText size={20} /> },
          { name: 'Brouillons', path: '/applicant/drafts', icon: <BookOpen size={20} /> },
          { name: t('nav.profile'), path: '/applicant/profile', icon: <User size={20} /> }
        ];
      case 'AGENT':
        return [
          { name: t('nav_agent.dashboard'), path: '/agent/dashboard', icon: <Home size={20} /> },
          { name: t('nav_agent.applications'), path: '/agent/applications', icon: <FileText size={20} /> },
          { name: t('nav_agent.pending_docs'), path: '/agent/pending-docs', icon: <FileWarning size={20} />, badge: newComplementsCount > 0 ? t('badges.new') : undefined },
          { name: 'Prorogations', path: '/agent/extensions', icon: <RefreshCcw size={20} /> },
          { name: t('nav_agent.payments'), path: '/agent/payments', icon: <BarChart size={20} /> },
          { name: t('nav.profile'), path: '/agent/profile', icon: <User size={20} /> }
        ];
      case 'ADMIN':
        return [
          { name: t('nav_admin.supervisor'), path: '/admin/dashboard', icon: <BarChart size={20} /> },
          { name: t('nav_admin.users'), path: '/admin/users', icon: <Users size={20} /> },
          { name: t('nav_admin.visa_types'), path: '/admin/visa-types', icon: <FileText size={20} /> },
          { name: t('nav_admin.logs'), path: '/admin/logs', icon: <FileWarning size={20} /> },
          { name: t('nav_admin.email_templates'), path: '/admin/email-templates', icon: <Mail size={20} /> },
          {name: t('nav_admin.messages'), path: '/admin/messages', icon: <Mail size={20} /> },
          {name: 'Prorogations', path: '/admin/extensions', icon: <RefreshCcw size={20} /> },
          {name: t('nav_admin.border_tracking'), path: '/admin/border-tracking', icon: <MapPin size={20} />, badge: t('badges.new') },
          { name: t('nav_admin.settings'), path: '/admin/settings', icon: <Settings size={20} /> },
          { name: t('nav_admin.watchlist'), path: '/admin/watchlist', icon: <ShieldAlert size={20} />, badge: t('badges.security') },
          { name: t('nav.profile'), path: '/admin/profile', icon: <User size={20} /> }
        ];
      case 'EMBASSY':
        return [
          { name: t('nav_agent.dashboard'), path: `/agent/dashboard`, icon: <Home size={20} /> },
          { name: t('nav_agent.applications'), path: '/agent/applications', icon: <FileText size={20} /> },
          { name: t('nav_agent.pending_docs'), path: '/agent/pending-docs', icon: <FileWarning size={20} />, badge: newComplementsCount > 0 ? t('badges.new') : undefined },
          { name: 'Prorogations', path: '/agent/extensions', icon: <RefreshCcw size={20} /> },
          { name: t('nav_agent.payments'), path: '/agent/payments', icon: <BarChart size={20} /> },
          { name: t('nav.profile'), path: '/agent/profile', icon: <User size={20} /> }
        ];
      case 'BORDER':
        return [
          { name: t('nav_border.dashboard'), path: '/frontiere/dashboard', icon: <Home size={20} /> },
          { name: t('nav_admin.watchlist'), path: '/admin/watchlist', icon: <ShieldAlert size={20} /> },
          { name: t('nav_border.verification'), path: '/frontiere/verification', icon: <ShieldCheck size={20} /> },
          { name: t('nav_border.history'), path: '/frontiere/historique', icon: <FileText size={20} /> },
          { name: t('nav_border.alerts'), path: '/frontiere/alertes', icon: <FileWarning size={20} /> },
          { name: t('nav.profile'), path: '/frontiere/profile', icon: <User size={20} /> }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-cm-cream flex flex-col">
      {/* ── MOBILE OVERLAY ── */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-cm-dark/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── TOP SECTION: SIDEBAR + MAIN ── */}
      <div className="flex flex-1 w-full relative">
        {/* ── SIDEBAR ── */}
        <aside className={`
          fixed lg:sticky top-0 h-screen inset-y-0 left-0 z-50 w-72 bg-white border-r border-cm-border shadow-[4px_0_24px_rgba(0,0,0,0.02)]
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* LOGO AREA */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-cm-border bg-cm-cream/30">
          <CameroonFlag size={32} />
          <div>
            <div className="font-display font-bold text-cm-text text-lg leading-tight">e-Visa Cameroun</div>
            <div className="text-[0.6rem] font-bold tracking-widest text-cm-gold">RÉPUBLIQUE DU CAMEROUN</div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitcher />
            <button 
              className="lg:hidden p-2 text-cm-muted hover:text-cm-text"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PROFILE AREA */}
        <div className="p-6 border-b border-cm-border">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-cm-green-pale to-cm-green text-white flex items-center justify-center font-display font-bold text-lg shadow-inner">
              {user.first_name[0]}{user.last_name[0]}
            </div>
            <div>
              <div className="font-bold text-sm text-cm-text">{user.first_name} {user.last_name}</div>
              <div className="text-xs text-cm-muted">{user.email}</div>
            </div>
          </div>
          <div className="inline-flex items-center px-2.5 py-1 bg-cm-gold-pale/20 text-cm-gold rounded-md text-[0.65rem] font-bold tracking-wider uppercase">
            {t(`roles.${user.role.toLowerCase()}`)}
          </div>
        </div>

        {/* NAV LINKS */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm
                  ${isActive 
                    ? 'bg-cm-green-pale/10 text-cm-green border-l-4 border-cm-green shadow-sm' 
                    : 'text-cm-muted hover:bg-cm-cream hover:text-cm-text'}
                `}
              >
                <div className={`${isActive ? 'text-cm-green' : 'text-cm-muted'}`}>
                  {item.icon}
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="bg-cm-gold text-[9px] text-white px-1.5 py-0.5 rounded shadow-sm font-bold uppercase tracking-tighter animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT BUTTON */}
        <div className="p-4 border-t border-cm-border space-y-2">
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-cm-muted rounded-xl hover:bg-cm-cream hover:text-cm-text transition-colors"
          >
            <Home size={20} /> Accueil
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-cm-red rounded-xl hover:bg-cm-red/5 transition-colors"
          >
            <LogOut size={20} /> Se déconnecter
          </button>
        </div>
      </aside>

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* MOBILE TOPBAR */}
        <header className="lg:hidden h-16 bg-white border-b border-cm-border flex items-center justify-between px-4 shrink-0 shadow-sm z-30">
          <div className="flex items-center gap-2">
            <CameroonFlag size={24} />
            <span className="font-display font-bold text-cm-text text-sm">e-Visa</span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-cm-muted hover:text-cm-text bg-cm-cream rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 relative">
          {children || <Outlet />}
        </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
