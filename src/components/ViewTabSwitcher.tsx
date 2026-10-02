import { History, LayoutDashboard, UserRound } from 'lucide-react'
import type { AppView } from '../types/view'

interface ViewTabSwitcherProps {
  activeView: AppView
  onChange: (view: AppView) => void
}

const tabs: { id: AppView; label: string; icon: typeof UserRound }[] = [
  { id: 'patient', label: 'Patient View', icon: UserRound },
  { id: 'history', label: 'سجل الرحلات السابقة', icon: History },
  { id: 'staff', label: 'Hospital Staff View', icon: LayoutDashboard },
]

export function ViewTabSwitcher({ activeView, onChange }: ViewTabSwitcherProps) {
  return (
    <nav
      className="border-t border-slate-100 bg-slate-50/80"
      aria-label="تبديل واجهة العرض"
    >
      <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = activeView === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-current={active ? 'page' : undefined}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition sm:flex-none sm:px-5 ${
                active
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              <span className="truncate">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
