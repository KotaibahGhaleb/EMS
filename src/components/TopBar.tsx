import { Activity, Building2, Shield, UserRound } from 'lucide-react'
import type { PatientStatus } from '../types/patient'
import type { AppView } from '../types/view'
import { APP_NAME } from '../data/mockPatient'

const statusConfig: Record<
  PatientStatus,
  { label: string; className: string }
> = {
  stable: {
    label: 'مستقر',
    className: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  },
  waiting: {
    label: 'في الانتظار',
    className: 'bg-sky-100 text-sky-800 ring-sky-200',
  },
  in_treatment: {
    label: 'تحت العلاج',
    className: 'bg-blue-100 text-blue-800 ring-blue-200',
  },
  urgent: {
    label: 'حالة عاجلة',
    className: 'bg-amber-100 text-amber-900 ring-amber-300 animate-pulse-soft',
  },
}

interface TopBarProps {
  hospitalName: string
  patientName: string
  status: PatientStatus
  view: AppView
}

export function TopBar({ hospitalName, patientName, status, view }: TopBarProps) {
  const badge = statusConfig[status]
  const isStaff = view === 'staff'

  return (
    <header className="bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 text-white shadow-md">
            <Activity className="h-6 w-6" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-sky-600">{APP_NAME}</p>
            <div className="flex items-center gap-1.5 text-slate-800">
              <Building2 className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
              <h1 className="truncate text-sm font-semibold sm:text-base">
                {hospitalName}
              </h1>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {isStaff ? (
            <span className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-900 ring-1 ring-indigo-200">
              <Shield className="h-5 w-5 text-indigo-600" aria-hidden />
              مشرف الطوارئ
            </span>
          ) : (
            <>
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                <UserRound className="h-5 w-5 text-sky-600" aria-hidden />
                <span className="text-sm font-semibold text-slate-800">
                  {patientName}
                </span>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${badge.className}`}
              >
                {badge.label}
              </span>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
