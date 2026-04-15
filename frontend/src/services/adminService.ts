import api from './api';

export interface UserData {
  id?: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  role: string;
  is_active: boolean;
  password?: string;
}

/**
 * Helper: extrait le tableau depuis une réponse DRF paginée ou une liste directe.
 * Réponse paginée : { count, next, previous, results: [...] }
 * Réponse JSON personnalisée : { data: { results: [...] } } ou { data: [...] }
 */
function extractList(responseData: any): any[] {
  // Réponse paginée DRF standard
  if (Array.isArray(responseData?.results)) return responseData.results;
  // Réponse enveloppée data.results
  if (Array.isArray(responseData?.data?.results)) return responseData.data.results;
  // Réponse enveloppée data[]
  if (Array.isArray(responseData?.data)) return responseData.data;
  // Tableau direct
  if (Array.isArray(responseData)) return responseData;
  return [];
}

const adminService = {
  // ── Utilisateurs ──
  getUsers: async () => {
    const response = await api.get('/users/');
    return extractList(response.data);
  },

  createUser: async (userData: UserData) => {
    const response = await api.post('/users/', userData);
    return response.data.data || response.data;
  },

  getUserById: async (id: string) => {
    const response = await api.get(`/users/${id}/`);
    return response.data.data || response.data;
  },

  updateUser: async (id: string, userData: Partial<UserData>) => {
    const response = await api.patch(`/users/${id}/`, userData);
    return response.data.data || response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}/`);
    return response.data;
  },

  updateUserRole: async (id: string, role: string) => {
    const response = await api.post(`/users/${id}/update_role/`, { role });
    return response.data.data || response.data;
  },

  // ── Types de Visa ──
  getDashboardStats: async () => {
    const response = await api.get('/visa_applications/applications/dashboard_stats/');
    return response.data;
  },

  downloadDashboardReportPDF: async () => {
    const response = await api.get('/visa_applications/applications/export_pdf_report/', { responseType: 'blob' });
    return response.data;
  },

  getVisaTypes: async () => {
    const response = await api.get('/visa_applications/types/');
    return extractList(response.data);
  },

  getVisaTypeById: async (id: string) => {
    const response = await api.get(`/visa_applications/types/${id}/`);
    return response.data.data || response.data;
  },

  createVisaType: async (data: any) => {
    const response = await api.post('/visa_applications/types/', data);
    return response.data.data || response.data;
  },

  updateVisaType: async (id: string, data: any) => {
    const response = await api.patch(`/visa_applications/types/${id}/`, data);
    return response.data.data || response.data;
  },

  deleteVisaType: async (id: string) => {
    const response = await api.delete(`/visa_applications/types/${id}/`);
    return response.data;
  },
  // ── Audit Logs ──
  getAuditLogs: async () => {
    const response = await api.get('/audit-logs/');
    return extractList(response.data);
  },

  // ── Email Templates ──
  getEmailTemplates: async () => {
    const response = await api.get('/notifications/templates/');
    return extractList(response.data);
  },

  getEmailTemplateById: async (id: string) => {
    const response = await api.get(`/notifications/templates/${id}/`);
    return response.data;
  },

  createEmailTemplate: async (data: any) => {
    const response = await api.post('/notifications/templates/', data);
    return response.data.data || response.data;
  },

  updateEmailTemplate: async (id: string, data: any) => {
    const response = await api.patch(`/notifications/templates/${id}/`, data);
    return response.data.data || response.data;
  },

  deleteEmailTemplate: async (id: string) => {
    const response = await api.delete(`/notifications/templates/${id}/`);
    return response.data;
  },

  // ── Dashboard Stats ──

  // ── Contact Messages ──
  getContactMessages: async () => {
    // contact-messages est enregistré sous /api/ (pas /api/v1/)
    const response = await api.get('/../contact-messages/');
    return extractList(response.data);
  },

  replyContactMessage: async (id: string, data: { reply_message: string }) => {
    const response = await api.post(`/../contact-messages/${id}/reply/`, data);
    return response.data.data || response.data;
  },

  // ── Paramètres Système ──
  getSystemSettings: async () => {
    // on remonte d'un niveau par rapport à /api/v1 car les settings sont dans /api/system-settings/
    const response = await api.get('/../system-settings/');
    return extractList(response.data);
  },

  updateSystemSettings: async (settingsData: Record<string, any>) => {
    const response = await api.post('/../system-settings/bulk_update/', settingsData);
    return response.data;
  },

  // ── Suivi des Entrées/Sorties ──
  getBorderTracking: async () => {
    const response = await api.get('/../border-crossings/tracking/');
    return extractList(response.data);
  }
};

export default adminService;
