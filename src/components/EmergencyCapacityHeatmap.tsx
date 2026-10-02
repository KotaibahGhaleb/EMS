import { Activity } from 'lucide-react'
import { capacityZones, levelStyles } from '../data/staffCapacity'

export function EmergencyCapacityHeatmap() {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            خريطة سعة الطوارئ
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Emergency Capacity Heatmap — تحديث لحظي (محاكاة)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600">
          <LegendDot className="bg-emerald-500" label="Green — متاح" />
          <LegendDot className="bg-amber-400" label="Yellow — متوسط" />
          <LegendDot className="bg-red-500" label="Red — حرج" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {capacityZones.map((zone) => {
          const style = levelStyles[zone.level]
          const pct = Math.round((zone.bedsUsed / zone.bedsTotal) * 100)

          return (
            <div
              key={zone.id}
              className={`group relative overflow-hidden rounded-xl p-4 text-white shadow-md transition ${style.cell}`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-bold leading-snug">{zone.name}</p>
                <Activity className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
              </div>
              <p className="mt-3 text-2xl font-bold tabular-nums">
                {zone.bedsUsed}/{zone.bedsTotal}
              </p>
              <p className="mt-1 text-xs font-medium text-white/90">
                {style.label} · {pct}%
              </p>
              {zone.waitMinutes > 0 && (
                <p className="mt-2 text-[11px] text-white/80">
                  انتظار تقريبي: {zone.waitMinutes} د
                </p>
              )}
              <span
                className={`absolute -bottom-6 -start-6 h-20 w-20 rounded-full opacity-30 ${style.dot}`}
                aria-hidden
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-full ${className}`} />
      {label}
    </span>
  )
}
