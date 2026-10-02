import {
  Check,
  FlaskConical,
  HeartPulse,
  LogOut,
  Stethoscope,
  UserCheck,
} from 'lucide-react'
import type { JourneyStep } from '../types/patient'
import { STEP_LABELS, STEP_ORDER } from '../data/mockPatient'

const stepIcons: Record<JourneyStep, typeof UserCheck> = {
  registration: UserCheck,
  vitals_triage: HeartPulse,
  waiting_doctor: Stethoscope,
  lab: FlaskConical,
  discharge: LogOut,
}

interface ProgressStepperProps {
  currentStep: JourneyStep
}

function stepIndex(step: JourneyStep) {
  return STEP_ORDER.indexOf(step)
}

export function ProgressStepper({ currentStep }: ProgressStepperProps) {
  const activeIndex = stepIndex(currentStep)

  return (
    <section
      className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80 sm:p-6"
      aria-label="مراحل مسار العلاج"
    >
      <h2 className="mb-5 text-base font-bold text-slate-800">
        مسارك في الطوارئ
      </h2>
      <ol className="relative flex flex-col gap-0 sm:flex-row sm:justify-between">
        {STEP_ORDER.map((step, index) => {
          const Icon = stepIcons[step]
          const isComplete = index < activeIndex
          const isCurrent = index === activeIndex
          const isUpcoming = index > activeIndex

          return (
            <li
              key={step}
              className="relative flex flex-1 flex-row items-start gap-3 pb-6 last:pb-0 sm:flex-col sm:items-center sm:pb-0 sm:text-center"
            >
              {index < STEP_ORDER.length - 1 && (
                <>
                  <span
                    className={`absolute start-[1.125rem] top-10 hidden h-0.5 w-[calc(100%-2.25rem)] sm:start-auto sm:top-5 sm:block sm:h-auto sm:w-full sm:translate-x-1/2 sm:border-t-2 sm:border-dashed ${
                      index < activeIndex
                        ? 'border-emerald-400 sm:border-solid'
                        : 'border-slate-200'
                    }`}
                    style={{ insetInlineStart: '50%' }}
                    aria-hidden
                  />
                  <span
                    className={`absolute start-5 top-10 h-[calc(100%-2.5rem)] w-0.5 border-s-s-2 border-dashed sm:hidden ${
                      index < activeIndex ? 'border-emerald-400' : 'border-slate-200'
                    }`}
                    aria-hidden
                  />
                </>
              )}

              <div
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                  isComplete
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                    : isCurrent
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/40 ring-4 ring-sky-100'
                      : 'bg-slate-100 text-slate-400 ring-1 ring-slate-200'
                }`}
              >
                {isComplete ? (
                  <Check className="h-5 w-5" strokeWidth={2.5} />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>

              <div className="min-w-0 pt-0.5 sm:mt-3 sm:pt-0">
                <p
                  className={`text-sm font-semibold leading-snug ${
                    isUpcoming ? 'text-slate-400' : 'text-slate-800'
                  }`}
                >
                  {STEP_LABELS[step]}
                </p>
                {isCurrent && (
                  <p className="mt-1 text-xs font-medium text-sky-600">
                    المرحلة الحالية
                  </p>
                )}
                {isComplete && (
                  <p className="mt-1 text-xs text-emerald-600">مكتمل</p>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
