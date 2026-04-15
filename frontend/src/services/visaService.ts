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

  verifyEVisa: async (query: string) => {
    // On utilise POST /api/evisas/verify/ (nécessite visa_number ou qr_code_data)
    // On envoie 'query' aux deux par simplicité
    const response = await api.post('/../evisas/verify/', { 
      visa_number: query,
      qr_code_data: query 
    });
    return response.data;
  },

  submitBorderCheckIn: async (evisaId: string, action: 'ENTRY' | 'EXIT' | 'DENIED', location: string = 'Aéroport International de Douala') => {
    // On remonte d'un niveau (v1 -> api) pour atteindre /api/border-crossings/
    const response = await api.post(`/../border-crossings/`, {
      evisa: evisaId,
      crossing_type: action,
      location: location,
      notes: ""
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
    
    // Création d'un lien invisible pour déclencher le téléchargement
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `evisa_${visaNumber}.pdf`);
    
    // Ajout et clic pour forcer le téléchargement (marche mieux sur mobile aussi)
    document.body.appendChild(link);
    link.click();
    
    // Nettoyage immédiat
    document.body.removeChild(link);
    
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
