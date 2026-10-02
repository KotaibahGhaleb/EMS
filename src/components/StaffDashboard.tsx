import { Activity, PhoneCall, Stethoscope, Users } from 'lucide-react'
import { EmergencyCapacityHeatmap } from './EmergencyCapacityHeatmap'

interface StaffDashboardProps {
  onSmartOvertimeCall: () => void
  overtimeSent: boolean
}

export function StaffDashboard({
  onSmartOvertimeCall,
  overtimeSent,
}: StaffDashboardProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-sky-100 bg-gradient-to-l from-sky-50 to-white p-5 ring-1 ring-sky-100 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white">
            <Stethoscope className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">لوحة طاقم الطوارئ</h1>
            <p className="mt-1 text-sm text-slate-600">
              مراقبة السعة، توزيع الأحمال، ونداءات الدعم الذكية للأطباء.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <StatChip icon={Users} label="مرضى نشطون" value="51" />
          <StatChip icon={Activity} label="متوسط الانتظار" value="28 د" />
          <StatChip icon={PhoneCall} label="نداءات اليوم" value="7" />
        </div>
      </div>

      <EmergencyCapacityHeatmap />

      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80 sm:p-6">
        <h2 className="text-base font-bold text-slate-900">إجراءات سريعة</h2>
        <p className="mt-1 text-sm text-slate-500">
          Smart call — يختار النظام أقرب الأطباء المتاحين تلقائياً.
        </p>
        <button
          type="button"
          onClick={onSmartOvertimeCall}
          disabled={overtimeSent}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-indigo-600 to-sky-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:from-indigo-700 hover:to-sky-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <PhoneCall className="h-5 w-5" />
          Send Smart  Call to Doctors
        </button>
        {overtimeSent && (
          <p className="mt-3 text-sm font-medium text-emerald-700">
            آخر نداء: تم التواصل مع 4 أطباء — في انتظار التأكيد
          </p>
        )}
      </section>
    </div>
  )
}

function StatChip({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl bg-white px-3 py-3 ring-1 ring-slate-200">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
    </div>
  )
}
