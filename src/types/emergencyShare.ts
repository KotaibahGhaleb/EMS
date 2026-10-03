import type { JourneyStep, PatientStatus } from './patient'

/** Mirrors DB table `emergency_share_sessions` (production). */
export interface EmergencyShareSession {
  id: string
  emergency_session_id: string
  share_token: string
  shared_with_phone: string
  shared_with_phone_e164: string
  patient_name: string
  hospital_name: string
  current_step: JourneyStep
  triage_status_label: string
  patient_status: PatientStatus
  room_number: string
  eta_minutes: number
  created_at: string
  expires_at: string
  revoked_at: string | null
  last_synced_at: string
}

export interface CreateEmergencyShareInput {
  sharedWithPhone: string
  patientName: string
  hospitalName: string
  emergencySessionId: string
  currentStep: JourneyStep
  triageStatusLabel: string
  patientStatus: PatientStatus
  roomNumber: string
  etaMinutes: number
}

export interface CreateEmergencyShareResult {
  session: EmergencyShareSession
  shareUrl: string
  smsPreview: string
  whatsAppUrl: string
}

export type ShareDeliveryChannel = 'sms' | 'whatsapp'
