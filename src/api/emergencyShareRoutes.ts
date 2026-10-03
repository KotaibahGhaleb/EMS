/**
 * Production REST contract (mocked in MVP via emergencyShareService).
 *
 * POST   /api/v1/emergency-sessions/:sessionId/share
 * GET    /api/v1/emergency-shares/:token
 * PATCH  /api/v1/emergency-shares/:token/sync
 * DELETE /api/v1/emergency-shares/:token
 * POST   /api/v1/emergency-shares/:token/notify  { channel: 'sms' | 'whatsapp' }
 * POST   /api/v1/emergency-sessions/:sessionId/patient-consent  { consented_at, policy_version }
 */

export const EMERGENCY_SHARE_API = {
  createShare: (sessionId: string) => `/api/v1/emergency-sessions/${sessionId}/share`,
  getShare: (token: string) => `/api/v1/emergency-shares/${token}`,
  syncShare: (token: string) => `/api/v1/emergency-shares/${token}/sync`,
  revokeShare: (token: string) => `/api/v1/emergency-shares/${token}`,
  notifyShare: (token: string) => `/api/v1/emergency-shares/${token}/notify`,
  logPatientConsent: (sessionId: string) =>
    `/api/v1/emergency-sessions/${sessionId}/patient-consent`,
} as const
