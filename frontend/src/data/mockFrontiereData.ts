// ─────────────────────────────────────────────
//  data/mockFrontiereData.ts
// ─────────────────────────────────────────────
export const mockFrontiereStats = {
  controleToday: 342,
  alertesDeclenchees: 5,
  visasInvalides: 12,
  averageScanTime: '1.2s'
};

export const mockControleHistory = [
  { id: 'CTRL-0994', type: 'ENTREE', visaId: 'VA-2024-8840', applicantName: 'Luis Garcia', passport: 'P98765432', time: '2024-03-12T14:30:00Z', status: 'AUTHORIZED', agent: 'Agent M. Biloa' },
  { id: 'CTRL-0993', type: 'SORTIE', visaId: 'VA-2024-8120', applicantName: 'Marie Dupont', passport: '12AB34567', time: '2024-03-12T14:15:00Z', status: 'AUTHORIZED', agent: 'Agent M. Biloa' },
  { id: 'CTRL-0992', type: 'ENTREE', visaId: 'VA-2024-7750', applicantName: 'Ahmed Yilmaz', passport: 'TR1234567', time: '2024-03-12T13:45:00Z', status: 'DENIED_EXPIRED', agent: 'Agent M. Biloa' },
  { id: 'CTRL-0991', type: 'ENTREE', visaId: 'VA-2024-8839', applicantName: 'Hans Müller', passport: 'D00000123', time: '2024-03-12T13:30:00Z', status: 'DENIED_FRAUD', agent: 'Agent M. Biloa' },
  { id: 'CTRL-0990', type: 'ENTREE', visaId: 'VA-2024-8500', applicantName: 'Jane Smith', passport: 'US9876543', time: '2024-03-12T13:00:00Z', status: 'AUTHORIZED', agent: 'Agent M. Biloa' },
];

export const mockAlerts = [
  { id: 'ALT-105', type: 'FRAUD', message: 'Tentative d\'utilisation d\'un visa falsifié (VA-2024-8839)', time: '2024-03-12T13:30:00Z', severity: 'CRITICAL', status: 'UNRESOLVED' },
  { id: 'ALT-104', type: 'INTERPOL', message: 'Signalement Interpol sur le passeport D00000123', time: '2024-03-12T13:30:00Z', severity: 'CRITICAL', status: 'RESOLVED' },
  { id: 'ALT-103', type: 'SYSTEM', message: 'Latence détectée sur le serveur de base de données biométrique', time: '2024-03-12T10:15:00Z', severity: 'WARNING', status: 'RESOLVED' },
  { id: 'ALT-102', type: 'OVERSTAY', message: 'Le passager Ahmed Yilmaz a dépassé son séjour autorisé de 5 jours', time: '2024-03-12T13:45:00Z', severity: 'HIGH', status: 'UNRESOLVED' },
];
