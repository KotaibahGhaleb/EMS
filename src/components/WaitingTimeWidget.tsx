import { Clock, TrendingDown, Zap } from 'lucide-react'
import type { JourneyStep } from '../types/patient'
import { STEP_LABELS } from '../data/mockPatient'

interface WaitingTimeWidgetProps {
  minutes: number
  currentStep: JourneyStep
  highlightNext?: boolean
}

export function WaitingTimeWidget({
  minutes,
  currentStep,
  highlightNext = false,
}: WaitingTimeWidgetProps) {
  const progress = Math.min(100, Math.max(15, 100 - minutes * 1.2))

  return (
    <section
      className={`rounded-2xl p-5 text-white shadow-lg sm:p-6 ${
        highlightNext
          ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30 ring-2 ring-emerald-300/50'
          : 'bg-gradient-to-br from-sky-500 to-emerald-600 shadow-sky-500/25'
      }`}
    >
      {highlightNext && (
        <p className="mb-3 inline-flex items-center gap-1.5 rounded-lg bg-white/20 px-2.5 py-1 text-xs font-bold">
          <Zap className="h-3.5 w-3.5" />
          دورك هو التالي
        </p>
      )}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-sky-100">الوقت المتوقع للانتظار</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold tabular-nums">{minutes}</span>
            <span className="text-lg font-semibold text-sky-100">دقيقة</span>
          </div>
          <p className="mt-2 text-sm text-white/90">
            للمرحلة: {STEP_LABELS[currentStep]}
          </p>
        </div>
        <div className="rounded-xl bg-white/15 p-3 backdrop-blur-sm">
          <Clock className="h-8 w-8" aria-hidden />
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-sky-100">
          <span>تقدّم الانتظار</span>
          <span className="inline-flex items-center gap-1">
            <TrendingDown className="h-3.5 w-3.5" />
            يتحسّن
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  )
}
