import { ExternalLink, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { writePatientShareConsent } from '../lib/shareConsentStorage'
import { logPatientShareConsent } from '../services/emergencyShareService'
import {
  SHARE_CONSENT_POLICY_VERSION,
  type PatientShareConsentRecord,
} from '../types/shareConsent'

const PRIVACY_SUMMARY = `سياسة الخصوصية (ملخص): تُستخدم بيانات رحلتك في الطوارئ (الوقت، الفرز، الموقع) لتقديم الخدمة ومشاركة الحالة التشغيلية مع من تختارهم فقط. لا نبيع بياناتك الصحية.`

const TERMS_SUMMARY = `شروط الاستخدام (ملخص): مسار أداة مساعدة وليس تشخيصاً طبياً. أنت مسؤول عن مشاركة الرابط مع أشخاص تثق بهم. اتبع تعليمات فريق الطوارئ في المستشفى.`

interface PatientShareConsentModalProps {
  open: boolean
  emergencySessionId: string
  onConsented: () => void
  /** When false, user must agree (entry gate) — no dismiss button. */
  allowDismiss?: boolean
  onClose?: () => void
}

export function PatientShareConsentModal({
  open,
  emergencySessionId,
  onConsented,
  allowDismiss = false,
  onClose,
}: PatientShareConsentModalProps) {
  const [checked, setChecked] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [legalView, setLegalView] = useState<'none' | 'privacy' | 'terms'>('none')

  if (!open) return null

  const handleContinue = async () => {
    if (!checked) {
      setError('يرجى تأكيد الموافقة على سياسة الخصوصية وشروط الاستخدام.')
      return
    }
    setError(null)
    setSubmitting(true)
    const record: PatientShareConsentRecord = {
      emergency_session_id: emergencySessionId,
      consented_at: new Date().toISOString(),
      policy_version: SHARE_CONSENT_POLICY_VERSION,
      user_agent: navigator.userAgent,
      purpose: 'patient_ed_share',
    }
    try {
      writePatientShareConsent(record)
      await logPatientShareConsent(record)
      onConsented()
    } catch {
      setError('تعذر تسجيل الموافقة. حاول مرة أخرى.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[85] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="patient-consent-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-sky-100">
        <div className="border-b border-sky-50 bg-gradient-to-l from-sky-50 to-white px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600 text-white">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h2 id="patient-consent-title" className="text-base font-bold text-slate-900">
                {allowDismiss ? 'الموافقة قبل المشاركة' : 'الموافقة على الخصوصية'}
              </h2>
              <p className="text-xs text-slate-600">
                {allowDismiss
                  ? 'مطلوب قبل إرسال رابط للأقارب'
                  : 'مطلوب لاستخدام لوحة الطوارئ — للمريض'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 px-5 py-4">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <span className="text-sm leading-relaxed text-slate-800">
              أقر بأني اطلعت على{' '}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  setLegalView('privacy')
                }}
                className="font-bold text-sky-700 underline decoration-sky-300 underline-offset-2 hover:text-sky-900"
              >
                سياسة الخصوصية
              </button>{' '}
              و{' '}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  setLegalView('terms')
                }}
                className="font-bold text-sky-700 underline decoration-sky-300 underline-offset-2 hover:text-sky-900"
              >
                شروط الاستخدام
              </button>{' '}
              وأوافق على معالجة البيانات التشغيلية الخاصة برحلتي العلاجية داخل قسم
              الطوارئ.
            </span>
          </label>

          {legalView !== 'none' && (
            <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-3 text-xs leading-relaxed text-slate-700">
              <p className="mb-2 flex items-center gap-1 font-bold text-sky-900">
                <ExternalLink className="h-3.5 w-3.5" />
                {legalView === 'privacy' ? 'سياسة الخصوصية' : 'شروط الاستخدام'}
              </p>
              <p>{legalView === 'privacy' ? PRIVACY_SUMMARY : TERMS_SUMMARY}</p>
              <button
                type="button"
                onClick={() => setLegalView('none')}
                className="mt-2 text-xs font-semibold text-sky-700 hover:underline"
              >
                إغلاق
              </button>
            </div>
          )}

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-800 ring-1 ring-red-100">
              {error}
            </p>
          )}

          <div className="flex gap-2">
            {allowDismiss && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200"
              >
                إلغاء
              </button>
            )}
            <button
              type="button"
              disabled={submitting}
              onClick={() => void handleContinue()}
              className="flex-1 rounded-xl bg-gradient-to-l from-sky-600 to-teal-600 py-3 text-sm font-bold text-white shadow-md transition hover:from-sky-700 hover:to-teal-700 disabled:opacity-60"
            >
              {submitting ? 'جاري التسجيل…' : 'أوافق والمتابعة'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
