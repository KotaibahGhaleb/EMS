import { APP_NAME, PATIENT_NAME } from '../data/mockPatient'
import { normalizeSaudiPhone } from '../lib/phoneValidation'
import type {
  CreateEmergencyShareInput,
  CreateEmergencyShareResult,
  EmergencyShareSession,
  ShareDeliveryChannel,
} from '../types/emergencyShare'
import type { PatientShareConsentRecord } from '../types/shareConsent'

const STORAGE_KEY = 'masar_emergency_share_sessions'
const CONSENT_AUDIT_KEY = 'masar_share_consent_audit_log'
const SHARE_TTL_MS = 24 * 60 * 60 * 1000

function readStore(): Record<string, EmergencyShareSession> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, EmergencyShareSession>
  } catch {
    return {}
  }
}

function writeStore(sessions: Record<string, EmergencyShareSession>) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}

function generateToken(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

export function buildShareUrl(token: string): string {
  const base = typeof window !== 'undefined' ? window.location.origin : ''
  const path = import.meta.env.BASE_URL ?? '/'
  const normalizedBase = `${base}${path}`.replace(/\/$/, '')
  return `${normalizedBase}/#/share/${token}`
}

function buildInviteMessage(session: EmergencyShareSession, shareUrl: string): string {
  return [
    `${APP_NAME} — مشاركة حالة طوارئ`,
    `المريض: ${session.patient_name}`,
    `المستشفى: ${session.hospital_name}`,
    `الحالة: ${session.triage_status_label}`,
    `الوقت المتوقع: ${session.eta_minutes} دقيقة`,
    `تابع الرحلة مباشرة: ${shareUrl}`,
    `(رابط آمن ينتهي خلال 24 ساعة)`,
  ].join('\n')
}

function toSession(input: CreateEmergencyShareInput, token: string): EmergencyShareSession {
  const now = new Date()
  const phone = normalizeSaudiPhone(input.sharedWithPhone)
  return {
    id: crypto.randomUUID(),
    emergency_session_id: input.emergencySessionId,
    share_token: token,
    shared_with_phone: phone.display,
    shared_with_phone_e164: phone.e164,
    patient_name: input.patientName,
    hospital_name: input.hospitalName,
    current_step: input.currentStep,
    triage_status_label: input.triageStatusLabel,
    patient_status: input.patientStatus,
    room_number: input.roomNumber,
    eta_minutes: input.etaMinutes,
    created_at: now.toISOString(),
    expires_at: new Date(now.getTime() + SHARE_TTL_MS).toISOString(),
    revoked_at: null,
    last_synced_at: now.toISOString(),
  }
}

/** Mock POST /api/v1/emergency-sessions/:id/share */
export async function createEmergencyShare(
  input: CreateEmergencyShareInput,
): Promise<CreateEmergencyShareResult> {
  const phone = normalizeSaudiPhone(input.sharedWithPhone)
  if (!phone.valid) {
    throw new Error('INVALID_PHONE')
  }

  await delay(400)

  const token = generateToken()
  const session = toSession(input, token)
  const store = readStore()
  store[token] = session
  writeStore(store)

  const shareUrl = buildShareUrl(token)
  const smsPreview = buildInviteMessage(session, shareUrl)
  const whatsAppUrl = `https://wa.me/${phone.e164.replace('+', '')}?text=${encodeURIComponent(smsPreview)}`

  return { session, shareUrl, smsPreview, whatsAppUrl }
}

/** Mock GET /api/v1/emergency-shares/:token */
export async function getEmergencyShareByToken(
  token: string,
): Promise<EmergencyShareSession | null> {
  await delay(200)
  const store = readStore()
  const session = store[token]
  if (!session) return null
  if (session.revoked_at) return null
  if (new Date(session.expires_at).getTime() < Date.now()) return null
  return session
}

/** Mock PATCH sync — patient app pushes live journey updates. */
export async function syncEmergencyShare(
  token: string,
  patch: Pick<
    EmergencyShareSession,
    | 'current_step'
    | 'triage_status_label'
    | 'patient_status'
    | 'room_number'
    | 'eta_minutes'
    | 'hospital_name'
  >,
): Promise<void> {
  const store = readStore()
  const session = store[token]
  if (!session || session.revoked_at) return
  store[token] = {
    ...session,
    ...patch,
    last_synced_at: new Date().toISOString(),
  }
  writeStore(store)
  window.dispatchEvent(new CustomEvent('masar-share-updated', { detail: { token } }))
}

/** Mock POST notify — Twilio / Firebase SMS stub. */
export async function sendShareNotification(
  token: string,
  channel: ShareDeliveryChannel,
): Promise<{ ok: true; channel: ShareDeliveryChannel; preview: string }> {
  const session = await getEmergencyShareByToken(token)
  if (!session) throw new Error('SHARE_NOT_FOUND')

  await delay(600)

  const shareUrl = buildShareUrl(token)
  const preview = buildInviteMessage(session, shareUrl)

  if (channel === 'sms') {
    console.info('[MVP SMS mock → Twilio/Firebase]', {
      to: session.shared_with_phone_e164,
      body: preview,
    })
  } else {
    console.info('[MVP WhatsApp deep link]', { to: session.shared_with_phone_e164 })
  }

  return { ok: true, channel, preview }
}

/** Mock POST /api/v1/emergency-sessions/:id/patient-consent — audit log (patient, not viewer). */
export async function logPatientShareConsent(
  record: PatientShareConsentRecord,
): Promise<{ ok: true; audit_id: string }> {
  await delay(250)

  const audit_id = crypto.randomUUID()
  const entry = {
    audit_id,
    ...record,
    logged_at: new Date().toISOString(),
  }

  try {
    const raw = sessionStorage.getItem(CONSENT_AUDIT_KEY)
    const list = raw ? (JSON.parse(raw) as unknown[]) : []
    list.push(entry)
    sessionStorage.setItem(CONSENT_AUDIT_KEY, JSON.stringify(list))
  } catch {
    /* MVP — ignore storage failures */
  }

  console.info('[MVP patient consent audit]', entry)
  return { ok: true, audit_id }
}

export function getActiveShareTokenForSession(emergencySessionId: string): string | null {
  const store = readStore()
  const now = Date.now()
  for (const session of Object.values(store)) {
    if (session.emergency_session_id !== emergencySessionId) continue
    if (session.revoked_at) continue
    if (new Date(session.expires_at).getTime() < now) continue
    return session.share_token
  }
  return null
}

export const DEMO_EMERGENCY_SESSION_ID = 'ed-session-demo-001'

export function defaultPatientName() {
  return PATIENT_NAME
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
