export interface PatientShareConsentRecord {
  emergency_session_id: string
  consented_at: string
  policy_version: string
  user_agent: string
  purpose: 'patient_ed_share'
}

export const SHARE_CONSENT_POLICY_VERSION = '2026-03-1'
