// ─────────────────────────────────────────────
//  TYPES GLOBAUX — e-Visa Cameroun
// ─────────────────────────────────────────────

// ── AUTH ──────────────────────────────────────
export type UserRole = 'APPLICANT' | 'AGENT' | 'ADMIN' | 'EMBASSY' | 'BORDER';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: UserRole;
  is_active: boolean;
  is_email_verified: boolean;
  two_factor_enabled: boolean;
  embassy_country?: string;
  created_at: string;
  last_login: string | null;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

// ── VISA TYPES ────────────────────────────────
export interface VisaType {
  id: string;
  name: string;
  code: string;
  description: string;
  validity_days: number;
  max_stay_days: number;
  fee: number;
  required_documents: string[];
  processing_time_days: number;
  is_active: boolean;
}

// ── APPLICATION ───────────────────────────────
export type ApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'PROCESSING'
  | 'PENDING_DOCS'
  | 'DOCS_PROVIDED'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED';

export interface VisaApplication {
  id: string;
  application_number: string;
  applicant: string;
  visa_type: VisaType;
  assigned_agent: string | null;
  status: ApplicationStatus;
  full_name: string;
  date_of_birth: string;
  place_of_birth: string;
  nationality: string;
  residence_country: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  marital_status?: string;
  profession?: string;
  birth_country?: string;
  
  passport_number: string;
  passport_issue_date: string;
  passport_expiry_date: string;
  passport_country: string;

  purpose_of_visit: string;
  arrival_date: string;
  departure_date: string;
  address_in_cameroon: string;
  
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  
  // Avis / Traitement
  embassy_opinion: 'NONE' | 'FAVORABLE' | 'UNFAVORABLE';
  embassy_comment: string;
  border_check_status: 'PENDING' | 'AUTHORIZED' | 'DENIED';
  border_check_at?: string;
  has_biometrics?: boolean;
  border_agent: string | null;
  border_checked_at: string | null;
  processed_by: string | null;

  submitted_at: string | null;
  processed_at: string | null;
  rejection_reason: string;
  created_at: string;
  updated_at: string;

  // Traçabilité & Biométrie
  processed_by_name?: string;
  assigned_agent_name?: string;
  biometric_photos?: {
    face_image: string | null;
    passport_photo: string | null;
  };

  // Relations complémentaires
  documents?: ApplicationDocument[];
  payment?: Payment;
  payment_status?: string | null;
}

export interface ApplicationFormData {
  visa_type_id: string | null;
  full_name: string;
  date_of_birth: string;
  place_of_birth: string;
  nationality: string;
  gender: string;
  passport_number: string;
  passport_issue_date: string;
  passport_expiry_date: string;
  passport_country: string;
  purpose_of_visit: string;
  arrival_date: string;
  departure_date: string;
  address_in_cameroon: string;
}

// ── DOCUMENTS ────────────────────────────────
export type DocumentType =
  | 'PASSPORT'
  | 'PHOTO'
  | 'TRAVEL_ITINERARY'
  | 'ACCOMMODATION_PROOF'
  | 'FINANCIAL_PROOF'
  | 'INVITATION_LETTER'
  | 'OTHER';

export interface ApplicationDocument {
  id: string;
  application: string;
  document_type: DocumentType;
  file_name: string;
  file_size: number;
  mime_type: string;
  is_verified: boolean;
  uploaded_at: string;
  file_url?: string;
  file?: File | string;
}

// ── BIOMETRIC ────────────────────────────────
export interface BiometricData {
  id: string;
  application: string;
  quality_score: number;
  liveness_verified: boolean;
  is_verified: boolean;
  captured_at: string;
}

// ── PAYMENT ──────────────────────────────────
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'CARD' | 'MOBILE_MONEY_MTN' | 'MOBILE_MONEY_ORANGE' | 'PAYPAL';

export interface Payment {
  id: string;
  application: string;
  application_number: string;
  amount: number;
  currency: string;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  transaction_id: string | null;
  paid_at: string | null;
  created_at: string;
}

// ── E-VISA ────────────────────────────────────
export interface EVisa {
  id: string;
  application: string;
  visa_number: string;
  issue_date: string;
  expiry_date: string;
  qr_code: string;
  pdf_file_path: string;
  is_revoked: boolean;
}

// ── NOTIFICATION ─────────────────────────────
export interface Notification {
  id: string;
  user: string;
  application: string | null;
  notification_type: 'EMAIL' | 'SMS' | 'SYSTEM';
  subject: string;
  message: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  sent_at: string | null;
  read_at: string | null;
  created_at: string;
}

// ── AUDIT LOG ─────────────────────────────────
export interface AuditLog {
  id: string;
  user: User | null;
  application: string | null;
  action: string;
  description: string;
  ip_address: string | null;
  created_at: string;
}

// ── COMMENT ─────────────────────────────────
export interface ApplicationComment {
  id: string;
  application: string;
  author: User;
  content: string;
  is_internal: boolean;
  created_at: string;
}

// ── BORDER CROSSING ──────────────────────────
export interface BorderCrossing {
  id: string;
  evisa: EVisa;
  border_agent: User;
  crossing_type: 'ENTRY' | 'EXIT';
  location: string;
  crossing_date: string;
  notes: string;
}

// ── API RESPONSES ─────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
