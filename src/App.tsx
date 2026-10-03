import { useCallback, useEffect, useMemo, useState } from 'react'
import { RelativeShareDashboard } from './components/RelativeShareDashboard'
import { MedicalHistoryTimeline } from './components/MedicalHistoryTimeline'
import { MockControlPanel } from './components/MockControlPanel'
import { PatientDashboard } from './components/PatientDashboard'
import { StaffDashboard } from './components/StaffDashboard'
import { ToastNotification } from './components/ToastNotification'
import { TopBar } from './components/TopBar'
import { ViewTabSwitcher } from './components/ViewTabSwitcher'
import {
  HOSPITAL_NAME,
  PATIENT_NAME,
  SAHAFA_HOSPITAL_NAME,
  STEP_LABELS,
  STEP_ORDER,
  WAIT_MINUTES_BY_STEP,
  initialJourney,
} from './data/mockPatient'
import { initialDemoState } from './types/demo'
import type { DemoScenarioState } from './types/demo'
import type { PatientJourney } from './types/patient'
import type { AppView } from './types/view'
import { parseShareTokenFromUrl, subscribeShareRoute } from './lib/shareRouting'
import {
  DEMO_EMERGENCY_SESSION_ID,
  getActiveShareTokenForSession,
  syncEmergencyShare,
} from './services/emergencyShareService'

function resolveWaitMinutes(
  journey: PatientJourney,
  demo: DemoScenarioState,
): number {
  if (demo.doctorOvertime) return 3
  if (demo.transferredToSahafa) return 15
  if (demo.criticalCase) return 45
  return WAIT_MINUTES_BY_STEP[journey.currentStep] ?? journey.estimatedWaitMinutes
}

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('patient')
  const [journey, setJourney] = useState<PatientJourney>(initialJourney)
  const [demo, setDemo] = useState<DemoScenarioState>(initialDemoState)
  const [toast, setToast] = useState<string | null>(null)
  const [smartOvertimeSent, setSmartOvertimeSent] = useState(false)
  const [shareRouteToken, setShareRouteToken] = useState<string | null>(() =>
    parseShareTokenFromUrl(),
  )

  const displayHospital = demo.transferredToSahafa
    ? SAHAFA_HOSPITAL_NAME
    : HOSPITAL_NAME

  const displayWaitMinutes = useMemo(
    () => resolveWaitMinutes(journey, demo),
    [journey, demo],
  )

  const advanceStep = useCallback(() => {
    setJourney((prev) => {
      const idx = STEP_ORDER.indexOf(prev.currentStep)
      if (idx >= STEP_ORDER.length - 1) return prev
      const nextStep = STEP_ORDER[idx + 1]
      setToast(`تم الانتقال إلى: ${STEP_LABELS[nextStep]}`)
      return {
        ...prev,
        currentStep: nextStep,
        estimatedWaitMinutes: WAIT_MINUTES_BY_STEP[nextStep],
        status: nextStep === 'discharge' ? 'stable' : prev.status,
      }
    })
  }, [])

  const toggleCritical = useCallback(() => {
    setDemo((prev) => {
      const next = !prev.criticalCase
      if (next) {
        setToast('تم دخول حالة حرجة — تم تحديث وقت الانتظار')
        return {
          ...prev,
          criticalCase: true,
          doctorOvertime: false,
          transferredToSahafa: false,
        }
      }
      setToast('تم إيقاف سيناريو الحالة الحرجة')
      return { ...prev, criticalCase: false, transferredToSahafa: false }
    })
  }, [])

  const toggleOvertime = useCallback(() => {
    setDemo((prev) => {
      const next = !prev.doctorOvertime
      if (next) {
        setToast('تم تعزيز الكادر الطبي — دورك هو التالي')
        return {
          ...prev,
          doctorOvertime: true,
          criticalCase: false,
          transferredToSahafa: false,
        }
      }
      setToast('تم إيقاف سيناريو استدعاء الطبيب')
      return { ...prev, doctorOvertime: false }
    })
  }, [])

  const handleTransferSahafa = useCallback(() => {
    setDemo((prev) => ({
      ...prev,
      transferredToSahafa: true,
      criticalCase: true,
    }))
    setToast('تم التحويل إلى فرع الصحافة — انتظار 15 دقيقة')
  }, [])

  const handleSmartOvertimeCall = useCallback(() => {
    setSmartOvertimeSent(true)
    setToast('تم إرسال نداء الدعم لـ 4 أطباء متاحة')
  }, [])

  const topBarStatus = demo.doctorOvertime
    ? 'in_treatment'
    : demo.criticalCase && !demo.transferredToSahafa
      ? 'waiting'
      : journey.status

  const sharePatientStatus = topBarStatus

  const shareInput = useMemo(
    () => ({
      emergencySessionId: DEMO_EMERGENCY_SESSION_ID,
      patientName: PATIENT_NAME,
      hospitalName: displayHospital,
      currentStep: journey.currentStep,
      triageStatusLabel: STEP_LABELS[journey.currentStep],
      patientStatus: sharePatientStatus,
      roomNumber: journey.roomNumber,
      etaMinutes: displayWaitMinutes,
    }),
    [
      displayHospital,
      displayWaitMinutes,
      journey.currentStep,
      journey.roomNumber,
      sharePatientStatus,
    ],
  )

  useEffect(() => subscribeShareRoute(setShareRouteToken), [])

  useEffect(() => {
    const token = getActiveShareTokenForSession(DEMO_EMERGENCY_SESSION_ID)
    if (!token) return
    void syncEmergencyShare(token, {
      current_step: journey.currentStep,
      triage_status_label: STEP_LABELS[journey.currentStep],
      patient_status: sharePatientStatus,
      room_number: journey.roomNumber,
      eta_minutes: displayWaitMinutes,
      hospital_name: displayHospital,
    })
  }, [journey, displayWaitMinutes, displayHospital, sharePatientStatus])

  if (shareRouteToken) {
    return <RelativeShareDashboard token={shareRouteToken} />
  }

  return (
    <div dir="rtl" className="min-h-screen pb-28 font-sans sm:pb-8">
      <div className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md">
        <TopBar
          hospitalName={displayHospital}
          patientName={PATIENT_NAME}
          status={topBarStatus}
          view={activeView}
        />
        <ViewTabSwitcher activeView={activeView} onChange={setActiveView} />
      </div>

      <main className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6 sm:py-8">
        {activeView === 'patient' && (
          <PatientDashboard
            journey={journey}
            demo={demo}
            displayWaitMinutes={displayWaitMinutes}
            onAdvanceStep={advanceStep}
            onTransferSahafa={handleTransferSahafa}
            shareInput={shareInput}
            onNotify={setToast}
          />
        )}
        {activeView === 'history' && (
          <MedicalHistoryTimeline onNotify={setToast} />
        )}
        {activeView === 'staff' && (
          <StaffDashboard
            onSmartOvertimeCall={handleSmartOvertimeCall}
            overtimeSent={smartOvertimeSent}
          />
        )}
      </main>

      {activeView === 'patient' && (
        <MockControlPanel
          criticalCase={demo.criticalCase}
          doctorOvertime={demo.doctorOvertime}
          onToggleCritical={toggleCritical}
          onToggleOvertime={toggleOvertime}
        />
      )}

      <ToastNotification
        message={toast ?? ''}
        visible={Boolean(toast)}
        onDismiss={() => setToast(null)}
      />
    </div>
  )
}
