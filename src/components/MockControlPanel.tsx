import { FlaskConical, SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'

interface MockControlPanelProps {
  criticalCase: boolean
  doctorOvertime: boolean
  onToggleCritical: () => void
  onToggleOvertime: () => void
}

export function MockControlPanel({
  criticalCase,
  doctorOvertime,
  onToggleCritical,
  onToggleOvertime,
}: MockControlPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl transition hover:scale-110 hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 motion-safe:animate-pulse-soft"
        aria-label="فتح لوحة تحكم العرض التجريبي"
        aria-expanded={false}
      >
        <SlidersHorizontal className="h-5 w-5" aria-hidden />
      </button>
    )
  }

  return (
    <aside
      className="fixed bottom-6 right-6 z-50 w-[min(calc(100vw-2rem),20rem)] rounded-2xl border border-slate-700/80 bg-slate-900/95 p-3 text-white shadow-2xl backdrop-blur-md"
      aria-label="لوحة تحكم العرض التجريبي"
      aria-expanded={true}
    >
      <div className="relative mb-3 flex items-center gap-2 border-b border-white/10 pb-2 pe-8">
        <SlidersHorizontal className="h-4 w-4 shrink-0 text-sky-400" />
        <span className="text-xs font-bold text-slate-200">Mock Control — Pitch</span>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute right-0 top-0 rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
          aria-label="إغلاق لوحة التحكم"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2">
        <TogglePitchButton
          active={criticalCase}
          label="Trigger Critical Case"
          sublabel="حالة حرجة + توازن أحمال"
          onClick={onToggleCritical}
          activeClass="ring-amber-400/60 bg-amber-950/40"
        />
        <TogglePitchButton
          active={doctorOvertime}
          label="Doctor Overtime Call Triggered"
          sublabel="تعزيز كادر — دورك التالي"
          onClick={onToggleOvertime}
          activeClass="ring-emerald-400/60 bg-emerald-950/40"
        />
      </div>

      <p className="mt-3 flex items-center gap-1 text-[10px] leading-snug text-slate-500">
        <FlaskConical className="h-3 w-3 shrink-0" />
        للعرض فقط — لا يرسل للخادم
      </p>
    </aside>
  )
}

function TogglePitchButton({
  active,
  label,
  sublabel,
  onClick,
  activeClass,
}: {
  active: boolean
  label: string
  sublabel: string
  onClick: () => void
  activeClass: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`w-full rounded-xl px-3 py-2.5 text-start ring-1 ring-white/10 transition ${
        active ? activeClass : 'bg-white/5 hover:bg-white/10'
      }`}
    >
      <span className="block text-[11px] font-semibold leading-tight text-white">
        {label}
      </span>
      <span className="mt-0.5 block text-[10px] text-slate-400">{sublabel}</span>
      <span
        className={`mt-1.5 inline-block rounded px-1.5 py-0.5 text-[9px] font-bold ${
          active ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-400'
        }`}
      >
        {active ? 'ON' : 'OFF'}
      </span>
    </button>
  )
}
