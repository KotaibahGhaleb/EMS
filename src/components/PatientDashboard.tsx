import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { hasPatientShareConsent } from '../lib/shareConsentStorage'
import { CriticalCaseBanner } from './CriticalCaseBanner'
import { FloorPlanMap } from './FloorPlanMap'
import { PatientShareConsentModal } from './PatientShareConsentModal'
import { StaffBoostBanner } from './StaffBoostBanner'
import { WaitingTimeWidget } from './WaitingTimeWidget'
import { ShareWithRelativeButton } from './ShareWithRelativeButton'
import { WaitingGamesLauncher } from './waitingGames/WaitingGamesLauncher'
import type { DemoScenarioState } from '../types/demo'
import type { CreateEmergencyShareInput } from '../types/emergencyShare'
import type { PatientJourney } from '../types/patient'

interface PatientDashboardProps {
  journey: PatientJourney
  demo: DemoScenarioState
  displayWaitMinutes: number
  onAdvanceStep: () => void
  onTransferSahafa: () => void
  shareInput: Omit<CreateEmergencyShareInput, 'sharedWithPhone'>
  onNotify: (message: string) => void
}

export function PatientDashboard({
  journey,
  demo,
  displayWaitMinutes,
  onAdvanceStep,
  onTransferSahafa,
  shareInput,
  onNotify,
}: PatientDashboardProps) {
  const [patientConsented, setPatientConsented] = useState(() =>
    hasPatientShareConsent(shareInput.emergencySessionId),
  )

  return (
    <div className="relative">
      <div
        className={`space-y-5 transition-all duration-300 ${
          patientConsented ? 'opacity-100 blur-0' : 'pointer-events-none select-none opacity-40 blur-md'
        }`}
        aria-hidden={!patientConsented}
      >
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

        <ShareWithRelativeButton
          shareInput={shareInput}
          onNotify={onNotify}
          disabled={!patientConsented}
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

      {!patientConsented && (
        <PatientShareConsentModal
          open
          emergencySessionId={shareInput.emergencySessionId}
          onConsented={() => setPatientConsented(true)}
        />
      )}
    </div>
  )
}
