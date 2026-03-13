// ─────────────────────────────────────────────
//  data/mockAgentData.ts
// ─────────────────────────────────────────────
export const mockAgentStats = {
  pendingApplications: 412,
  processedToday: 48,
  approvedToday: 35,
  rejectedToday: 13,
  averageProcessingTime: '4.2 jours',
  satisfactionRate: '92%'
};

export const mockAgentApplications = [
  {
    id: 'VA-2024-9982',
    applicantName: 'Jean Dupont',
    nationality: 'France',
    type: 'Visa Tourisme',
    submissionDate: '2024-03-12T08:30:00Z',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    assignedTo: 'AGENT-01'
  },
  {
    id: 'VA-2024-9981',
    applicantName: 'Sarah Connor',
    nationality: 'USA',
    type: 'Visa Affaires',
    submissionDate: '2024-03-12T09:15:00Z',
    status: 'PENDING',
    priority: 'NORMAL',
    assignedTo: null
  },
  {
    id: 'VA-2024-9970',
    applicantName: 'Ahmed Hassan',
    nationality: 'Égypte',
    type: 'Visa Étudiant',
    submissionDate: '2024-03-11T14:20:00Z',
    status: 'PENDING',
    priority: 'NORMAL',
    assignedTo: null
  },
  {
    id: 'VA-2024-9965',
    applicantName: 'Yuki Tanaka',
    nationality: 'Japon',
    type: 'Visa Tourisme',
    submissionDate: '2024-03-11T16:45:00Z',
    status: 'APPROVED',
    priority: 'NORMAL',
    assignedTo: 'AGENT-01'
  },
  {
    id: 'VA-2024-9950',
    applicantName: 'Carlos Silva',
    nationality: 'Brésil',
    type: 'Visa Transit',
    submissionDate: '2024-03-10T10:00:00Z',
    status: 'REJECTED',
    priority: 'LOW',
    assignedTo: 'AGENT-01'
  }
];

export const mockRecentActivity = [
  { id: 1, action: 'Approuvé la demande', target: 'VA-2024-9965', time: 'Il y a 2 heures' },
  { id: 2, action: 'Rejeté la demande', target: 'VA-2024-9950', time: 'Il y a 5 heures' },
  { id: 3, action: 'Demandé des documents supplémentaires pour', target: 'VA-2024-9920', time: 'Hier' }
];
