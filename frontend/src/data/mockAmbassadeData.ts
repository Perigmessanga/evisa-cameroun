// ─────────────────────────────────────────────
//  data/mockAmbassadeData.ts
// ─────────────────────────────────────────────
export const mockAmbassadeStats = {
  pendingDossiers: 42,
  processedThisMonth: 156,
  averageProcessingTime: '48 Heures',
  messagesUnread: 5
};

export const mockDossiers = [
  { id: 'VA-2024-8842', applicantName: 'John Smith', nationality: 'Américaine (USA)', type: 'VCS', status: 'WAITING_EMBASSY', priority: 'HIGH', submissionDate: '2024-03-12T08:30:00Z' },
  { id: 'VA-2024-8843', applicantName: 'Emma Johnson', nationality: 'Canadienne', type: 'VLS', status: 'WAITING_EMBASSY', priority: 'NORMAL', submissionDate: '2024-03-11T14:15:00Z' },
  { id: 'VA-2024-8840', applicantName: 'Luis Garcia', nationality: 'Espagnole', type: 'VTR', status: 'EMBASSY_APPROVED', priority: 'NORMAL', submissionDate: '2024-03-10T10:00:00Z' },
  { id: 'VA-2024-8839', applicantName: 'Hans Müller', nationality: 'Allemande', type: 'VCS', status: 'EMBASSY_REJECTED', priority: 'HIGH', submissionDate: '2024-03-09T16:45:00Z' },
  { id: 'VA-2024-8835', applicantName: 'Alice Dubois', nationality: 'Française', type: 'VDS', status: 'WAITING_EMBASSY', priority: 'URGENT', submissionDate: '2024-03-12T11:00:00Z' },
];

export const mockMessages = [
  { id: 1, from: 'Agent DGSN (M. Essomba)', subject: 'Avis urgent requis sur dossier VA-2024-8842', date: '2024-03-12T09:15:00Z', isRead: false },
  { id: 2, from: 'DGSN Centrale', subject: 'Nouvelle directive consulaire - Mars 2024', date: '2024-03-10T08:00:00Z', isRead: false },
  { id: 3, from: 'Agent DGSN (A. Dubois)', subject: 'Clarification motif de séjour VA-2024-8835', date: '2024-03-12T11:30:00Z', isRead: true },
];
