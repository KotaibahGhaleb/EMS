import { Sparkles, Stethoscope } from 'lucide-react'

interface StaffBoostBannerProps {
  visible: boolean
}

export function StaffBoostBanner({ visible }: StaffBoostBannerProps) {
  if (!visible) return null

  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-2xl border border-emerald-300 bg-gradient-to-l from-emerald-50 to-sky-50 px-4 py-4 shadow-sm ring-1 ring-emerald-200/80 sm:px-5"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md">
        <Stethoscope className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-emerald-700">
          <Sparkles className="h-3.5 w-3.5" />
          تحديث من غرفة العمليات
        </p>
        <p className="mt-1 text-base font-bold text-slate-900">
          تم تعزيز الكادر الطبي، دورك هو التالي
        </p>
        <p className="mt-1 text-sm text-slate-600">
          تم استدعاء طبيب إضافي — يرجى التجهز للدخول إلى الغرفة قريباً.
        </p>
      </div>
    </div>
  )
}
