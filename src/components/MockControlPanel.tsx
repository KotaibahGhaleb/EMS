import { FlaskConical, SlidersHorizontal } from 'lucide-react'

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
  return (
    <aside
      className="fixed bottom-4 right-4 z-[60] w-[min(calc(100vw-2rem),20rem)] rounded-2xl border border-slate-700/80 bg-slate-900/95 p-3 text-white shadow-2xl backdrop-blur-md sm:bottom-6 sm:right-6"
      aria-label="لوحة تحكم العرض التجريبي"
    >
      <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
        <SlidersHorizontal className="h-4 w-4 text-sky-400" />
        <span className="text-xs font-bold text-slate-200">Mock Control — Pitch</span>
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
