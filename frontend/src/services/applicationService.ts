// ─────────────────────────────────────────────
//  services/applicationService.ts
//  Gestion des demandes de visa
// ─────────────────────────────────────────────
import api from './api';
import type { VisaApplication, VisaType, ApplicationFormData, ApplicationComment, Payment } from '../types';

const applicationService = {
  // ── Visa Types ──────────────────────────────
  async getVisaTypes(): Promise<VisaType[]> {
    const { data } = await api.get('/visa/visa-types/');
    return data.results || data.data || data;
  },

  // ── Applications ────────────────────────────
  async getApplications(): Promise<VisaApplication[]> {
    const { data } = await api.get('/visa/applications/');
    return data.results || data.data || data;
  },

  async getApplication(id: string): Promise<VisaApplication> {
    const { data } = await api.get(`/visa/applications/${id}/`);
    return data.data || data;
  },

  async createApplication(payload: ApplicationFormData): Promise<VisaApplication> {
    const { data } = await api.post('/visa/applications/', payload);
    return data.data || data;
  },

  async updateApplication(id: string, payload: Partial<ApplicationFormData>): Promise<VisaApplication> {
    const { data } = await api.patch(`/visa/applications/${id}/`, payload);
    return data.data || data;
  },

  async submitApplication(id: string): Promise<VisaApplication> {
    const { data } = await api.post(`/visa/applications/${id}/submit/`);
    return data.data || data;
  },

  async updateStatus(id: string, status: string, rejection_reason?: string): Promise<VisaApplication> {
    const { data } = await api.post(`/visa/applications/${id}/update_status/`, { status, rejection_reason });
    return data.data || data;
  },

  async getStats(): Promise<Record<string, unknown>> {
    const { data } = await api.get('/visa/applications/stats/');
    return data.data || data;
  },

  // ── Comments ────────────────────────────────
  async getComments(applicationId: string): Promise<ApplicationComment[]> {
    const { data } = await api.get(`/visa/applications/${applicationId}/comments/`);
    return data.data || data;
  },

  async addComment(applicationId: string, content: string, is_internal: boolean): Promise<ApplicationComment> {
    const { data } = await api.post(`/visa/applications/${applicationId}/add_comment/`, { content, is_internal });
    return data.data || data;
  },

  // ── Documents ───────────────────────────────
  async uploadDocument(applicationId: string, formData: FormData): Promise<void> {
    await api.post(`/visa/applications/${applicationId}/documents/`, formData, {
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
  async submitBiometric(payload: {
    application_id: string;
    face_image_base64: string;
    liveness_verified: boolean;
    quality_score?: number;
    face_encoding?: Record<string, unknown>;
  }): Promise<void> {
    await api.post('/biometrics/capture/', payload);
  },
};

export default applicationService;
