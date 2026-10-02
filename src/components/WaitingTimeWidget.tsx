import { Check, ChevronDown, ChevronUp, Clock, TrendingDown, Zap } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { JourneyStep } from '../types/patient'
import { STEP_LABELS, STEP_ORDER } from '../data/mockPatient'

/** Shorter labels for completed-step history inside the wait card */
const COMPLETED_HISTORY_LABELS: Record<JourneyStep, string> = {
  registration: 'اكتمل التسجيل',
  vitals_triage: 'العلامات الحيوية',
  waiting_doctor: 'انتظار الطبيب',
  lab: 'المختبر',
  discharge: 'الخروج',
}

interface WaitingTimeWidgetProps {
  minutes: number
  currentStep: JourneyStep
  highlightNext?: boolean
}

function completedStepsBefore(currentStep: JourneyStep): JourneyStep[] {
  const activeIndex = STEP_ORDER.indexOf(currentStep)
  if (activeIndex <= 0) return []
  return STEP_ORDER.slice(0, activeIndex)
}

export function WaitingTimeWidget({
  minutes,
  currentStep,
  highlightNext = false,
}: WaitingTimeWidgetProps) {
  const [historyOpen, setHistoryOpen] = useState(false)
  const completedSteps = useMemo(
    () => completedStepsBefore(currentStep),
    [currentStep],
  )
  const canExpandHistory = completedSteps.length > 0
  const progress = Math.min(100, Math.max(15, 100 - minutes * 1.2))

  return (
    <section
      className={`relative rounded-2xl p-5 pb-12 text-white shadow-lg sm:p-6 sm:pb-12 ${
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

        <div
          className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${
            historyOpen && canExpandHistory
              ? 'mt-4 grid-rows-[1fr] opacity-100'
              : 'mt-0 grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <ul className="space-y-2 border-t border-white/20 pt-3" role="list">
              {completedSteps.map((step) => (
                <li key={step}>
                  <span className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-2.5 py-1.5 text-xs font-medium text-white/95">
                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-200" strokeWidth={2.5} />
                    {COMPLETED_HISTORY_LABELS[step]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {canExpandHistory && (
        <button
          type="button"
          onClick={() => setHistoryOpen((open) => !open)}
          className="absolute bottom-3 end-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white transition hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
          aria-expanded={historyOpen}
          aria-label={historyOpen ? 'إخفاء المراحل المكتملة' : 'عرض المراحل المكتملة'}
        >
          {historyOpen ? (
            <ChevronUp className="h-4 w-4" aria-hidden />
          ) : (
            <ChevronDown className="h-4 w-4" aria-hidden />
          )}
        </button>
      )}
    </section>
  )
}
