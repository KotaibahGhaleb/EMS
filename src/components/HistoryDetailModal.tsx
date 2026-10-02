import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface HistoryDetailModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export function HistoryDetailModal({
  open,
  title,
  onClose,
  children,
}: HistoryDetailModalProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-modal-title"
    >
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <h3 id="history-modal-title" className="text-lg font-bold text-slate-900">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4 text-sm leading-relaxed text-slate-700">{children}</div>
      </div>
    </div>
  )
}
