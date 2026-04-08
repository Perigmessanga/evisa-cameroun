import api from './api';
import { VisaApplication } from '../types';

const visaService = {
  // ── IMMIGRATION ──
  getImmigrationStats: async () => {
    const response = await api.get('/visa_applications/immigration/stats/');
    return response.data.data;
  },

  getImmigrationApplications: async (filters: any = {}) => {
    const response = await api.get('/visa_applications/immigration/applications/', { params: filters });
    return response.data.data;
  },

  submitImmigrationDecision: async (id: string, decision: 'APPROVE' | 'REJECT', reason?: string) => {
    const response = await api.post(`/visa_applications/immigration/applications/${id}/decision/`, {
      decision,
      reason
    });
    return response.data;
  },

  // ── EMBASSY ──
  getEmbassyApplications: async () => {
    const response = await api.get('/visa_applications/embassy/applications/');
    return response.data.data;
  },

  submitEmbassyOpinion: async (id: string, opinion: 'FAVORABLE' | 'UNFAVORABLE', comment: string) => {
    const response = await api.post(`/visa_applications/embassy/applications/${id}/opinion/`, {
      opinion,
      comment
    });
    return response.data;
  },

  // ── BORDER CONTROL ──
  verifyEVisa: async (query: string) => {
    const response = await api.get('/visa_applications/border/verify/', { params: { query } });
    return response.data.data;
  },

  submitBorderCheckIn: async (id: string, action: 'ENTRY' | 'EXIT' | 'DENIED') => {
    const response = await api.post(`/visa_applications/border/applications/${id}/check-in/`, {
      action
    });
    return response.data;
  },

  getBorderStats: async () => {
    const response = await api.get('/visa_applications/border/stats/');
    return response.data.data;
  },

  getBorderHistory: async () => {
    const response = await api.get('/visa_applications/border/history/');
    return response.data.data;
  },

  getBorderAlerts: async () => {
    const response = await api.get('/visa_applications/border/alerts/');
    return response.data.data;
  },

  // ── GENERAL ──
  getApplicationById: async (id: string): Promise<VisaApplication> => {
    const response = await api.get(`/visa_applications/applications/${id}/`);
    return response.data.data || response.data;
  },
  
  addComment: async (id: string, content: string, isInternal: boolean = true) => {
    const response = await api.post(`/visa_applications/applications/${id}/add_comment/`, {
      content,
      is_internal: isInternal
    });
    return response.data;
  },

  getComments: async (id: string) => {
    const response = await api.get(`/visa_applications/applications/${id}/comments/`);
    return response.data.data || response.data;
  },

  downloadEVisa: async (evisaId: string, visaNumber: string) => {
    // On remonte d'un niveau par rapport à /api/v1 (car evisa-download est sous /api/)
    // On utilise responseType 'blob' pour gérer l'octet du PDF
    const response = await api.get(`/../evisas/${evisaId}/download/`, {
      responseType: 'blob'
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    
    // Pour mobile, l'ouverture dans un nouvel onglet est souvent plus fiable que link.click()
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      window.open(url, '_blank');
    } else {
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `evisa_${visaNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
    
    // Libérer la mémoire après un délai pour laisser le temps au téléchargement/ouverture
    setTimeout(() => window.URL.revokeObjectURL(url), 10000);
  },

  uploadSupplementaryDocs: async (id: string, files: File[]) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    const response = await api.post(`/visa_applications/applications/${id}/upload_supplementary_docs/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};

export default visaService;
