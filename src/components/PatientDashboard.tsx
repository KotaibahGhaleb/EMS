import { ChevronLeft } from 'lucide-react'
import { CriticalCaseBanner } from './CriticalCaseBanner'
import { FloorPlanMap } from './FloorPlanMap'
import { ProgressStepper } from './ProgressStepper'
import { StaffBoostBanner } from './StaffBoostBanner'
import { UrgentActionButton } from './UrgentActionButton'
import { WaitingTimeWidget } from './WaitingTimeWidget'
import { WaitingGamesLauncher } from './waitingGames/WaitingGamesLauncher'
import type { DemoScenarioState } from '../types/demo'
import type { PatientJourney } from '../types/patient'

interface PatientDashboardProps {
  journey: PatientJourney
  demo: DemoScenarioState
  displayWaitMinutes: number
  onAdvanceStep: () => void
  onUrgent: () => void
  onTransferSahafa: () => void
}

export function PatientDashboard({
  journey,
  demo,
  displayWaitMinutes,
  onAdvanceStep,
  onUrgent,
  onTransferSahafa,
}: PatientDashboardProps) {
  return (
    <div className="space-y-5">
      <StaffBoostBanner visible={demo.doctorOvertime} />

      <CriticalCaseBanner
        visible={demo.criticalCase && !demo.doctorOvertime}
        transferred={demo.transferredToSahafa}
        onTransfer={onTransferSahafa}
      />

      <ProgressStepper currentStep={journey.currentStep} />

      <div className="grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <FloorPlanMap
            roomNumber={journey.roomNumber}
            currentStep={journey.currentStep}
          />
        </div>
        <div className="flex flex-col gap-5 lg:col-span-2">
          <WaitingTimeWidget
            minutes={displayWaitMinutes}
            currentStep={journey.currentStep}
            highlightNext={demo.doctorOvertime}
          />
          <WaitingGamesLauncher
            waitMinutes={displayWaitMinutes}
            roomNumber={journey.roomNumber}
            queueTurnActive={demo.doctorOvertime}
            currentStep={journey.currentStep}
          />
          <UrgentActionButton onUrgentRequest={onUrgent} />
        </div>
      </div>

      <div className="flex justify-center border-t border-slate-200 pt-6">
        <button
          type="button"
          onClick={onAdvanceStep}
          disabled={journey.currentStep === 'discharge'}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm ring-1 ring-sky-200 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          محاكاة: الانتقال للمرحلة التالية
        </button>
      </div>
    </div>
  )
}
