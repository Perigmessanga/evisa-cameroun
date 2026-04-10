// ─────────────────────────────────────────────
//  services/applicationService.ts
//  Gestion des demandes de visa
// ─────────────────────────────────────────────
import api from './api';
import type { VisaApplication, VisaType, ApplicationFormData, ApplicationComment, Payment } from '../types';

const applicationService = {
  // ── Visa Types ──────────────────────────────
  async getVisaTypes(): Promise<VisaType[]> {
    const { data } = await api.get('/visa_applications/types/');
    return data.results || data.data || data;
  },

  // ── Applications ────────────────────────────
  async getApplications(): Promise<VisaApplication[]> {
    const { data } = await api.get('/visa_applications/applications/');
    return data.results || data.data || data;
  },

  async getApplication(id: string): Promise<VisaApplication> {
    const { data } = await api.get(`/visa_applications/applications/${id}/`);
    return data.data || data;
  },

    getApplicationById: async (id: string): Promise<VisaApplication> => {
    const response = await api.get(`/visa_applications/applications/${id}/`);
    return response.data.data || response.data;
  },

  async createApplication(payload: ApplicationFormData): Promise<VisaApplication> {
    const { data } = await api.post('/visa_applications/applications/', payload);
    return data.data || data;
  },

  async updateApplication(id: string, payload: Partial<ApplicationFormData>): Promise<VisaApplication> {
    const { data } = await api.patch(`/visa_applications/applications/${id}/`, payload);
    return data.data || data;
  },

  async submitApplication(id: string): Promise<VisaApplication> {
    const { data } = await api.post(`/visa_applications/applications/${id}/submit/`);
    return data.data || data;
  },

  async updateStatus(id: string, status: string, rejection_reason?: string): Promise<VisaApplication> {
    const { data } = await api.post(`/visa_applications/applications/${id}/update_status/`, { status, rejection_reason });
    return data.data || data;
  },

  async getStats(): Promise<Record<string, unknown>> {
    const { data } = await api.get('/visa_applications/applications/stats/');
    return data.data || data;
  },

  // ── Comments ────────────────────────────────
  async getComments(applicationId: string): Promise<ApplicationComment[]> {
    const { data } = await api.get(`/visa_applications/applications/${applicationId}/comments/`);
    return data.data || data;
  },

  async addComment(applicationId: string, content: string, is_internal: boolean): Promise<ApplicationComment> {
    const { data } = await api.post(`/visa_applications/applications/${applicationId}/add_comment/`, { content, is_internal });
    return data.data || data;
  },

  // ── Documents ───────────────────────────────
  async uploadDocument(applicationId: string, formData: FormData): Promise<void> {
    await api.post(`/visa_applications/applications/${applicationId}/upload_document/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // ── Payments ────────────────────────────────
  async initiatePayment(applicationId: string, paymentMethod: string): Promise<Payment> {
    const { data } = await api.post('/payments/initiate/', {
      application_id: applicationId,
      payment_method: paymentMethod,
    });
    return data.data || data;
  },

  async confirmPayment(transactionId: string, paymentMethod: string): Promise<Payment> {
    const { data } = await api.post('/payments/confirm/', {
      transaction_id: transactionId,
      payment_method: paymentMethod,
    });
    return data.data || data;
  },

  // ── Biometrics ──────────────────────────────
  async submitBiometric(payload: FormData): Promise<void> {
    // We send form data because BiometricDataViewSet create() uses form data with 'face_image' file 
    await api.post('/biometrics/', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // ── Notifications ───────────────────────────
  async getNotifications(): Promise<{ notifications: any[], unread_count: number }> {
    const { data } = await api.get('/notifications/');
    return data.data || data;
  },

  async markNotificationRead(id: string): Promise<void> {
    await api.post(`/notifications/${id}/mark_read/`);
  },

  async markAllNotificationsRead(): Promise<void> {
    await api.post('/notifications/mark_all_read/');
  },
};

export default applicationService;
