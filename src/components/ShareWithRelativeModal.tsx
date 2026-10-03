import { Check, Copy, Link2, MessageCircle, Phone, Send, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { isValidSharePhone, normalizeSaudiPhone } from '../lib/phoneValidation'
import {
  createEmergencyShare,
  sendShareNotification,
} from '../services/emergencyShareService'
import type { CreateEmergencyShareInput, CreateEmergencyShareResult } from '../types/emergencyShare'

interface ShareWithRelativeModalProps {
  open: boolean
  onClose: () => void
  shareInput: Omit<CreateEmergencyShareInput, 'sharedWithPhone'>
  onNotify: (message: string) => void
}

export function ShareWithRelativeModal({
  open,
  onClose,
  shareInput,
  onNotify,
}: ShareWithRelativeModalProps) {
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<CreateEmergencyShareResult | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open) {
      setPhone('')
      setError(null)
      setResult(null)
      setCopied(false)
      setSubmitting(false)
    }
  }, [open])

  const phonePreview = normalizeSaudiPhone(phone)

  const handleCreate = useCallback(async () => {
    if (!isValidSharePhone(phone)) {
      setError('أدخل رقم جوال سعودي صحيح (مثال: 05xxxxxxxx أو +9665xxxxxxxx)')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      const created = await createEmergencyShare({
        ...shareInput,
        sharedWithPhone: phone,
      })
      setResult(created)
      onNotify('تم إنشاء رابط المشاركة الآمن')
    } catch (e) {
      setError(e instanceof Error && e.message === 'INVALID_PHONE'
        ? 'رقم الجوال غير صالح'
        : 'تعذر إنشاء الرابط — حاول مرة أخرى')
    } finally {
      setSubmitting(false)
    }
  }, [phone, shareInput, onNotify])

  const handleSendSms = async () => {
    if (!result) return
    setSubmitting(true)
    try {
      await sendShareNotification(result.session.share_token, 'sms')
      onNotify(`تم إرسال رسالة SMS (محاكاة) إلى ${result.session.shared_with_phone}`)
    } catch {
      setError('تعذر إرسال SMS')
    } finally {
      setSubmitting(false)
    }
  }

  const handleWhatsApp = async () => {
    if (!result) return
    await sendShareNotification(result.session.share_token, 'whatsapp')
    window.open(result.whatsAppUrl, '_blank', 'noopener,noreferrer')
    onNotify('تم فتح واتساب مع رسالة الدعوة')
  }

  const copyLink = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result.shareUrl)
    setCopied(true)
    onNotify('تم نسخ الرابط')
    window.setTimeout(() => setCopied(false), 2000)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-900/50 p-4 sm:items-center">
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-relative-title"
      >
        <header className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <h2 id="share-relative-title" className="text-base font-bold text-slate-900">
            مشاركة مع قريب
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-4 px-4 py-4">
          {!result ? (
            <>
              <p className="text-sm text-slate-600">
                أرسل رابطاً آمناً ينتهي خلال 24 ساعة ليتابع قريبك حالة الطوارئ والموقع دون تعديل
                البيانات.
              </p>
              <label className="block">
                <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Phone className="h-3.5 w-3.5" />
                  رقم جوال القريب
                </span>
                <div className="flex overflow-hidden rounded-xl ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-sky-400">
                  <span className="flex items-center bg-slate-50 px-3 text-sm font-bold text-slate-600">
                    +966
                  </span>
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="5xxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="min-w-0 flex-1 border-0 px-3 py-3 text-sm outline-none"
                    dir="ltr"
                  />
                </div>
                {phone.length > 0 && (
                  <span
                    className={`mt-1 block text-xs ${phonePreview.valid ? 'text-emerald-600' : 'text-amber-700'}`}
                  >
                    {phonePreview.valid
                      ? `الرقم المعتمد: ${phonePreview.e164}`
                      : 'صيغة مقبولة: 05xxxxxxxx أو +9665xxxxxxxx'}
                  </span>
                )}
              </label>
              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-800 ring-1 ring-red-100">
                  {error}
                </p>
              )}
              <button
                type="button"
                disabled={submitting}
                onClick={() => void handleCreate()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 py-3 text-sm font-bold text-white transition hover:bg-sky-700 disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {submitting ? 'جاري الإنشاء…' : 'إرسال الدعوة / الرابط'}
              </button>
            </>
          ) : (
            <>
              <div className="rounded-xl bg-emerald-50 px-3 py-3 ring-1 ring-emerald-100">
                <p className="flex items-center gap-2 text-sm font-bold text-emerald-900">
                  <Check className="h-4 w-4" />
                  الرابط جاهز للمشاركة
                </p>
                <p className="mt-1 break-all text-xs text-emerald-800" dir="ltr">
                  {result.shareUrl}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void copyLink()}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-100 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-200"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  نسخ الرابط
                </button>
                <button
                  type="button"
                  onClick={() => void handleSendSms()}
                  disabled={submitting}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-sky-50 py-2.5 text-xs font-bold text-sky-800 ring-1 ring-sky-100 hover:bg-sky-100 disabled:opacity-60"
                >
                  <Link2 className="h-4 w-4" />
                  SMS (محاكاة)
                </button>
              </div>
              <button
                type="button"
                onClick={() => void handleWhatsApp()}
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-bold text-white hover:bg-[#1fb855] disabled:opacity-60"
              >
                <MessageCircle className="h-4 w-4" />
                إرسال عبر واتساب
              </button>
              <p className="text-xs leading-relaxed text-slate-500">
                تتضمن الرسالة: اسم المريض، المستشفى، حالة الفرز، ووقت الانتظار المتوقع مع رابط
                التتبع المباشر.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
