import { AlertTriangle, ArrowLeftRight, Building2, Clock, Users } from 'lucide-react'

const CURRENT_BRANCH = 'فرع الملك فهد — طوارئ'
const SAHAFA_BRANCH = 'فرع الصحافة — طوارئ'

interface CriticalCaseBannerProps {
  visible: boolean
  transferred: boolean
  onTransfer: () => void
}

export function CriticalCaseBanner({
  visible,
  transferred,
  onTransfer,
}: CriticalCaseBannerProps) {
  if (!visible) return null

  const currentWait = 45
  const sahafaWait = 15

  return (
    <div className="space-y-4">
      <div
        role="alert"
        className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-4 shadow-sm ring-1 ring-amber-200/80 sm:px-5"
      >
        <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" />
        <div>
          <p className="font-bold text-amber-950">
            تم دخول حالة حرجة، يتوقع تأخر دورك 45 دقيقة
          </p>
          <p className="mt-1 text-sm text-amber-900/80">
            يمكنك البقاء هنا أو الانتقال لفرع أقل ازدحاماً عبر توازن الأحمال.
          </p>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200">
        <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-800">
              توازن الأحمال — مقارنة الفروع
            </h3>
          </div>
        </div>

        <div className="grid gap-0 sm:grid-cols-2">
          <div
            className={`border-b border-slate-100 p-4 sm:border-b-0 sm:border-e ${
              transferred ? 'opacity-60' : 'bg-sky-50/50 ring-2 ring-inset ring-sky-200'
            }`}
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <Building2 className="h-4 w-4" />
                موقعك الحالي
              </span>
              {!transferred && (
                <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800">
                  أنت هنا
                </span>
              )}
            </div>
            <p className="text-sm font-bold text-slate-900">{CURRENT_BRANCH}</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-4 w-4 text-amber-600" />
                  وقت الانتظار
                </span>
                <span className="font-bold text-amber-700">{currentWait} د</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  الازدحام
                </span>
                <span className="font-semibold text-red-600">مرتفع</span>
              </li>
            </ul>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-[88%] rounded-full bg-red-500" />
            </div>
          </div>

          <div
            className={`p-4 ${transferred ? 'bg-emerald-50 ring-2 ring-inset ring-emerald-300' : ''}`}
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <Building2 className="h-4 w-4 text-emerald-600" />
                بديل مقترح
              </span>
              {transferred && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  تم التحويل
                </span>
              )}
            </div>
            <p className="text-sm font-bold text-slate-900">{SAHAFA_BRANCH}</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  وقت الانتظار
                </span>
                <span className="font-bold text-emerald-700">{sahafaWait} د</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  الازدحام
                </span>
                <span className="font-semibold text-emerald-600">متوسط</span>
              </li>
            </ul>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-[42%] rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-4 sm:px-5">
          {transferred ? (
            <p className="text-center text-sm font-semibold text-emerald-800">
              تم حجز موعدك في فرع الصحافة — انتظار متوقع 15 دقيقة
            </p>
          ) : (
            <button
              type="button"
              onClick={onTransfer}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-emerald-600 to-sky-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:from-emerald-700 hover:to-sky-700"
            >
              الانتقال لفرع الصحافة (انتظار 15 دقيقة)
            </button>
          )}
        </div>
      </section>
    </div>
  )
}
