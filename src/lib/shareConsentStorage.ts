import type { PatientShareConsentRecord } from '../types/shareConsent'
import { SHARE_CONSENT_POLICY_VERSION } from '../types/shareConsent'

const PATIENT_CONSENT_KEY = 'masar_patient_ed_consent'

export function readPatientShareConsent(
  emergencySessionId: string,
): PatientShareConsentRecord | null {
  try {
    const raw = localStorage.getItem(PATIENT_CONSENT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PatientShareConsentRecord
    if (parsed.emergency_session_id !== emergencySessionId) return null
    if (parsed.policy_version !== SHARE_CONSENT_POLICY_VERSION) return null
    return parsed
  } catch {
    return null
  }
}

export function writePatientShareConsent(record: PatientShareConsentRecord): void {
  localStorage.setItem(PATIENT_CONSENT_KEY, JSON.stringify(record))
}

export function hasPatientShareConsent(emergencySessionId: string): boolean {
  return readPatientShareConsent(emergencySessionId) !== null
}
