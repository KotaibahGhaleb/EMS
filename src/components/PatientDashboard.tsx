import { ChevronLeft } from 'lucide-react'
import { CriticalCaseBanner } from './CriticalCaseBanner'
import { FloorPlanMap } from './FloorPlanMap'
import { StaffBoostBanner } from './StaffBoostBanner'
import { WaitingTimeWidget } from './WaitingTimeWidget'
import { WaitingGamesLauncher } from './waitingGames/WaitingGamesLauncher'
import type { DemoScenarioState } from '../types/demo'
import type { PatientJourney } from '../types/patient'

interface PatientDashboardProps {
  journey: PatientJourney
  demo: DemoScenarioState
  displayWaitMinutes: number
  onAdvanceStep: () => void
  onTransferSahafa: () => void
}

export function PatientDashboard({
  journey,
  demo,
  displayWaitMinutes,
  onAdvanceStep,
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

      <FloorPlanMap
        roomNumber={journey.roomNumber}
        currentStep={journey.currentStep}
      />

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
