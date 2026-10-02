import { Volume2, VolumeX, Vibrate } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest'

const PHASE_ORDER: BreathPhase[] = ['inhale', 'hold', 'exhale', 'rest']

const PHASE_LABELS: Record<BreathPhase, string> = {
  inhale: 'شهيق عميق...',
  hold: 'احبس أنفاسك...',
  exhale: 'زفير بطيء...',
  rest: 'استرح...',
}

const PHASE_SECONDS = 4

const SCALE_BY_PHASE: Record<BreathPhase, string> = {
  inhale: 'scale-110',
  hold: 'scale-110',
  exhale: 'scale-90',
  rest: 'scale-[0.72]',
}

interface GuidedBreathingExerciseProps {
  paused: boolean
}

function playSoftTone(enabled: boolean) {
  if (!enabled || typeof window === 'undefined') return
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = 440
    gain.gain.value = 0.06
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
    osc.stop(ctx.currentTime + 0.16)
    void ctx.close()
  } catch {
    /* ignore — optional feedback */
  }
}

function triggerHaptic(enabled: boolean) {
  if (!enabled || typeof navigator === 'undefined' || !navigator.vibrate) return
  navigator.vibrate(40)
}

function formatSessionMessage(totalSeconds: number): string {
  if (totalSeconds < 60) {
    return `مدة التمرين: ${totalSeconds} ثانية`
  }
  const minutes = Math.floor(totalSeconds / 60)
  if (minutes === 1) return 'أكملت دقيقة واحدة 🧘‍♂️'
  if (minutes === 2) return 'أكملت دقيقتين 🧘‍♂️'
  return `أكملت ${minutes} دقائق 🧘‍♂️`
}

export function GuidedBreathingExercise({ paused }: GuidedBreathingExerciseProps) {
  const [running, setRunning] = useState(false)
  const [phase, setPhase] = useState<BreathPhase>('rest')
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [soundOn, setSoundOn] = useState(false)
  const [hapticOn, setHapticOn] = useState(true)

  const advancePhase = useCallback(() => {
    setPhase((current) => {
      const index = PHASE_ORDER.indexOf(current)
      const next = PHASE_ORDER[(index + 1) % PHASE_ORDER.length]
      playSoftTone(soundOn)
      triggerHaptic(hapticOn)
      return next
    })
  }, [soundOn, hapticOn])

  useEffect(() => {
    if (!running || paused) return undefined
    const id = window.setInterval(advancePhase, PHASE_SECONDS * 1000)
    return () => window.clearInterval(id)
  }, [running, paused, advancePhase])

  useEffect(() => {
    if (!running || paused) return undefined
    const id = window.setInterval(() => {
      setElapsedSeconds((s) => s + 1)
    }, 1000)
    return () => window.clearInterval(id)
  }, [running, paused])

  const toggleRunning = () => {
    if (running) {
      setRunning(false)
      setPhase('rest')
      return
    }
    setPhase('inhale')
    playSoftTone(soundOn)
    triggerHaptic(hapticOn)
    setRunning(true)
  }

  const active = running && !paused

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-6 py-2">
      <div className="text-center">
        <p className="text-sm font-semibold text-teal-800/90">تمرين التهدئة والتنفس</p>
        <p className="mt-1 text-xs text-slate-500">تقنية المربع 4-4-4-4 (شهيق · حبس · زفير · راحة)</p>
      </div>

      <div className="relative flex h-56 w-full items-center justify-center rounded-3xl bg-gradient-to-b from-sky-50/90 via-teal-50/80 to-cyan-50/90 ring-1 ring-teal-100/80">
        <div
          className={`absolute h-40 w-40 rounded-full bg-gradient-to-br from-sky-300/50 to-teal-400/40 blur-2xl transition-all duration-[4000ms] ease-in-out ${
            active ? SCALE_BY_PHASE[phase] : 'scale-[0.72] opacity-60'
          }`}
          aria-hidden
        />
        <div
          className={`relative flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-sky-200/90 to-teal-300/80 shadow-[0_0_40px_rgba(45,212,191,0.45)] ring-2 ring-white/60 transition-all duration-[4000ms] ease-in-out ${
            active ? SCALE_BY_PHASE[phase] : 'scale-[0.72] opacity-70'
          } ${phase === 'hold' && active ? 'shadow-[0_0_56px_rgba(56,189,248,0.55)]' : ''}`}
        >
          <div
            className={`absolute inset-2 rounded-full border-2 border-white/50 transition-all duration-[4000ms] ease-in-out ${
              phase === 'hold' && active ? 'opacity-100' : 'opacity-40'
            }`}
            aria-hidden
          />
          <span className="relative z-10 px-3 text-center text-sm font-bold leading-snug text-teal-900">
            {active ? PHASE_LABELS[phase] : paused && running ? 'متوقف مؤقتاً…' : 'اضغط ابدأ للتمرين'}
          </span>
        </div>
      </div>

      <div className="flex w-full items-center justify-center gap-2 tabular-nums">
        <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 ring-1 ring-teal-100">
          {active ? `${PHASE_SECONDS} ث` : '—'} · {PHASE_LABELS[phase]}
        </span>
      </div>

      <p className="min-h-[1.25rem] text-center text-sm font-medium text-slate-600">
        {running ? formatSessionMessage(elapsedSeconds) : 'جلسة هادئة لتخفيف القلق أثناء الانتظار'}
      </p>

      <button
        type="button"
        onClick={toggleRunning}
        className={`w-full rounded-xl py-3 text-sm font-bold text-white shadow-md transition ${
          running
            ? 'bg-slate-600 hover:bg-slate-700'
            : 'bg-gradient-to-l from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700'
        }`}
      >
        {running ? 'إيقاف' : 'ابدأ التمارين'}
      </button>

      <div className="flex w-full gap-2">
        <button
          type="button"
          onClick={() => setSoundOn((v) => !v)}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ring-1 transition ${
            soundOn
              ? 'bg-sky-50 text-sky-800 ring-sky-200'
              : 'bg-slate-50 text-slate-600 ring-slate-200'
          }`}
        >
          {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          صوت تنبيه
        </button>
        <button
          type="button"
          onClick={() => setHapticOn((v) => !v)}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ring-1 transition ${
            hapticOn
              ? 'bg-teal-50 text-teal-800 ring-teal-200'
              : 'bg-slate-50 text-slate-600 ring-slate-200'
          }`}
        >
          <Vibrate className="h-4 w-4" />
          اهتزاز
        </button>
      </div>
    </div>
  )
}
