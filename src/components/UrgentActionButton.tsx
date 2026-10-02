import { AlertCircle, BellRing, X } from 'lucide-react'
import { useCallback, useState } from 'react'

interface UrgentActionButtonProps {
  onUrgentRequest: () => void
}

export function UrgentActionButton({ onUrgentRequest }: UrgentActionButtonProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [sent, setSent] = useState(false)

  const handleConfirm = useCallback(() => {
    setConfirmOpen(false)
    setSent(true)
    onUrgentRequest()
    window.setTimeout(() => setSent(false), 4000)
  }, [onUrgentRequest])

  return (
    <>
      <section className="rounded-2xl border-2 border-amber-200 bg-amber-50/80 p-5 ring-1 ring-amber-100 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <BellRing className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">إجراء عاجل</h2>
              <p className="mt-1 text-sm text-slate-600">
                تحتاج مساعدة فورية؟ سيتم إبلاغ فريق التمريض في غرفة الانتظار.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={sent}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <AlertCircle className="h-5 w-5" />
            {sent ? 'تم إرسال الطلب' : 'طلب مساعدة عاجلة'}
          </button>
        </div>
      </section>

      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="urgent-dialog-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <h3 id="urgent-dialog-title" className="text-lg font-bold text-slate-900">
                تأكيد طلب المساعدة
              </h3>
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="إغلاق"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              سيتم إرسال تنبيه إلى فريق الطوارئ. استخدم هذا الخيار فقط إذا كنت بحاجة
              إلى مساعدة طبية فورية.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700"
              >
                نعم، أحتاج مساعدة
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
