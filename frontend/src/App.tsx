import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import ApplicantDashboard from './pages/applicant/DashboardPage';
import ApplicationFormPage from './pages/applicant/ApplicationFormPage';
import PaymentPage from './pages/applicant/PaymentPage';
import TrackingPage from './pages/applicant/TrackingPage';
import DownloadVisaPage from './pages/applicant/DownloadVisaPage';
import ProfilePage from './pages/applicant/ProfilePage';
import AgentDashboard from './pages/agent/DashboardPage';
import ApplicationsListPage from './pages/agent/ApplicationsListPage';
import ApplicationDetailPage from './pages/agent/ApplicationDetailPage';
import AgentProfilePage from './pages/agent/AgentProfilePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import VisaTypeManagementPage from './pages/admin/VisaTypeManagementPage';
import SystemSettingsPage from './pages/admin/SystemSettingsPage';
import ReportsStatisticsPage from './pages/admin/ReportsStatisticsPage';
import SystemLogsPage from './pages/admin/SystemLogsPage';
import EmailTemplatesPage from './pages/admin/EmailTemplatesPage';
import AmbassadeDashboardPage from './pages/ambassade/AmbassadeDashboardPage';
import DossiersListPage from './pages/ambassade/DossiersListPage';
import DossierDetailPage from './pages/ambassade/DossierDetailPage';
import MessageriePage from './pages/ambassade/MessageriePage';
import AmbassadeProfilePage from './pages/ambassade/AmbassadeProfilePage';

// Pages to be created in phase 3-8
// Using a generic placeholder for now
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-cm-border p-8">
      <h1 className="font-display text-2xl font-bold text-cm-text">{title}</h1>
      <p className="mt-2 text-cm-muted">Cette page est en cours de développement (Phase suivante).</p>
    </div>
  );
}

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cm-cream">
        <div className="w-12 h-12 border-4 border-cm-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" toastOptions={{
        className: 'font-body text-sm',
        success: { iconTheme: { primary: '#2D6A4F', secondary: '#fff' } },
        error: { iconTheme: { primary: '#CE1126', secondary: '#fff' } },
      }} />

      <Routes>
        {/* ── PUBLIC ROUTES ── */}
        <Route path="/" element={<HomePage />} />
        
        {/* ── AUTH ROUTES ── */}
        <Route path="/auth">
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password/:uid/:token" element={<ResetPasswordPage />} />
          <Route path="verify-email/:uid/:token" element={<VerifyEmailPage />} />
        </Route>

        {/* ── APPLICANT ROUTES ── */}
        <Route path="/applicant" element={<ProtectedRoute allowedRoles={['APPLICANT']}><DashboardLayout><Outlet/></DashboardLayout></ProtectedRoute>}>
          <Route path="dashboard" element={<ApplicantDashboard />} />
          <Route path="application" element={<ApplicationFormPage />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="tracking" element={<TrackingPage />} />
          <Route path="download-visa/:id" element={<DownloadVisaPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* ── AGENT ROUTES ── */}
        <Route path="/agent" element={<ProtectedRoute allowedRoles={['AGENT']}><DashboardLayout><Outlet/></DashboardLayout></ProtectedRoute>}>
          <Route path="dashboard" element={<AgentDashboard />} />
          <Route path="applications" element={<ApplicationsListPage />} />
          <Route path="applications/:id" element={<ApplicationDetailPage />} />
          <Route path="profile" element={<AgentProfilePage />} />
        </Route>

        {/* ── ADMIN ROUTES ── */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><DashboardLayout><Outlet/></DashboardLayout></ProtectedRoute>}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="visa-types" element={<VisaTypeManagementPage />} />
          <Route path="reports" element={<ReportsStatisticsPage />} />
          <Route path="logs" element={<SystemLogsPage />} />
          <Route path="email-templates" element={<EmailTemplatesPage />} />
          <Route path="settings" element={<SystemSettingsPage />} />
        </Route>

        {/* ── EMBASSY ROUTES ── */}
        <Route path="/ambassade" element={<ProtectedRoute allowedRoles={['EMBASSY']}><DashboardLayout><Outlet/></DashboardLayout></ProtectedRoute>}>
          <Route path="dashboard" element={<AmbassadeDashboardPage />} />
          <Route path="dossiers" element={<DossiersListPage />} />
          <Route path="dossiers/:id" element={<DossierDetailPage />} />
          <Route path="messagerie" element={<MessageriePage />} />
          <Route path="profile" element={<AmbassadeProfilePage />} />
        </Route>

        {/* ── BORDER ROUTES ── */}
        <Route path="/frontiere" element={<ProtectedRoute allowedRoles={['BORDER']}><DashboardLayout><Outlet/></DashboardLayout></ProtectedRoute>}>
          <Route path="dashboard" element={<PlaceholderPage title="Tableau de bord Frontière" />} />
          <Route path="verification" element={<PlaceholderPage title="Vérification QR Code" />} />
          <Route path="historique" element={<PlaceholderPage title="Historique Contrôles" />} />
          <Route path="alertes" element={<PlaceholderPage title="Alertes Sécurité" />} />
          <Route path="profile" element={<PlaceholderPage title="Mon Profil" />} />
        </Route>

        {/* ── FALLBACK ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
