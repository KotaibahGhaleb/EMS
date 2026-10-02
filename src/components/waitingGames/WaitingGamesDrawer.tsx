import { Gamepad2, Sparkles, X } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { JourneyStep } from '../../types/patient'
import { ArabicWordle } from './ArabicWordle'
import { GuidedBreathingExercise } from './GuidedBreathingExercise'
import { TilePuzzle } from './TilePuzzle'

type GameTab = 'wordle' | 'puzzle' | 'breathing'

interface WaitingGamesDrawerProps {
  open: boolean
  onClose: () => void
  waitMinutes: number
  roomNumber: string
  queueTurnActive: boolean
  currentStep: JourneyStep
}

export function WaitingGamesDrawer({
  open,
  onClose,
  waitMinutes,
  roomNumber,
  queueTurnActive,
  currentStep,
}: WaitingGamesDrawerProps) {
  const [tab, setTab] = useState<GameTab>('wordle')
  const [paused, setPaused] = useState(false)
  const [showTurnAlert, setShowTurnAlert] = useState(false)
  const prevStep = useRef(currentStep)

  useEffect(() => {
    if (!open) {
      setShowTurnAlert(false)
      setPaused(false)
      return
    }
    if (queueTurnActive) {
      setPaused(true)
      setShowTurnAlert(true)
    }
  }, [open, queueTurnActive])

  useEffect(() => {
    if (!open) {
      prevStep.current = currentStep
      return
    }
    const advancedFromWaiting =
      prevStep.current === 'waiting_doctor' && currentStep !== 'waiting_doctor'
    if (advancedFromWaiting && currentStep === 'lab') {
      setPaused(true)
      setShowTurnAlert(true)
    }
    if (queueTurnActive) {
      setPaused(true)
      setShowTurnAlert(true)
    }
    prevStep.current = currentStep
  }, [currentStep, queueTurnActive, open])

  if (!open) return null

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[70] bg-slate-900/40 backdrop-blur-[2px]"
        aria-label="إغلاق ألعاب الانتظار"
        onClick={() => !showTurnAlert && onClose()}
      />

      <aside
        className="fixed inset-y-0 start-0 z-[71] flex w-full max-w-md flex-col bg-white shadow-2xl ring-1 ring-slate-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="waiting-games-title"
      >
        <div className="sticky top-0 z-10 border-b border-sky-100 bg-sky-50 px-4 py-2.5 text-center text-xs font-bold text-sky-900">
          وقت الانتظار المتوقع: {waitMinutes} دقيقة | دورك ينبهك فوراً
        </div>

        <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-sky-600" />
            <h2 id="waiting-games-title" className="text-base font-bold text-slate-900">
              ألعاب الانتظار
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex gap-1 border-b border-slate-100 p-2">
          <TabButton active={tab === 'wordle'} onClick={() => setTab('wordle')}>
            كلمة الصحة
          </TabButton>
          <TabButton active={tab === 'puzzle'} onClick={() => setTab('puzzle')}>
            تركيب الصور
          </TabButton>
          <TabButton active={tab === 'breathing'} onClick={() => setTab('breathing')}>
            تمرين التنفس 🫁
          </TabButton>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {paused && !showTurnAlert && (
            <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900 ring-1 ring-amber-200">
              اللعبة متوقفة مؤقتاً — انتظر تنبيه الدور
            </p>
          )}
          {tab === 'wordle' && (
            <ArabicWordle paused={paused || showTurnAlert} />
          )}
          {tab === 'puzzle' && (
            <TilePuzzle paused={paused || showTurnAlert} />
          )}
          {tab === 'breathing' && (
            <GuidedBreathingExercise paused={paused || showTurnAlert} />
          )}
        </div>
      </aside>

      {showTurnAlert && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/85 p-6">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl ring-4 ring-emerald-400/50">
            <Sparkles className="mx-auto h-10 w-10 text-emerald-500" />
            <p className="mt-4 text-xl font-bold leading-snug text-slate-900">
              🔔 حان دورك الآن!
            </p>
            <p className="mt-2 text-base font-semibold text-emerald-800">
              يرجى التوجه لغرفة {roomNumber}
            </p>
            <p className="mt-2 text-sm text-slate-600">حان دورك للدخول على الطبيب</p>
            <button
              type="button"
              onClick={() => {
                setShowTurnAlert(false)
                onClose()
              }}
              className="mt-6 w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700"
            >
              حسناً، أنا في الطريق
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-lg px-1.5 py-2.5 text-xs font-semibold transition sm:px-2 sm:text-sm ${
        active ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      {children}
    </button>
  )
}
