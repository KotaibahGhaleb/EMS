import { Gamepad2 } from 'lucide-react'
import { useState } from 'react'
import type { JourneyStep } from '../../types/patient'
import { WaitingGamesDrawer } from './WaitingGamesDrawer'

interface WaitingGamesLauncherProps {
  waitMinutes: number
  roomNumber: string
  queueTurnActive: boolean
  currentStep: JourneyStep
}

export function WaitingGamesLauncher({
  waitMinutes,
  roomNumber,
  queueTurnActive,
  currentStep,
}: WaitingGamesLauncherProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-violet-100 bg-gradient-to-l from-violet-50 to-sky-50 px-4 py-3.5 text-start shadow-sm ring-1 ring-violet-100/80 transition hover:from-violet-100/80 hover:to-sky-100/80"
      >
        <span className="text-sm font-bold text-slate-800">تسلَّ أثناء الانتظار 🎮</span>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-white shadow-md">
          <Gamepad2 className="h-4 w-4" />
        </span>
      </button>

      <WaitingGamesDrawer
        open={open}
        onClose={() => setOpen(false)}
        waitMinutes={waitMinutes}
        roomNumber={roomNumber}
        queueTurnActive={queueTurnActive}
        currentStep={currentStep}
      />
    </>
  )
}
