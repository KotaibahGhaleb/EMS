import { CheckCircle2, X } from 'lucide-react'

interface ToastNotificationProps {
  message: string
  visible: boolean
  onDismiss: () => void
}

export function ToastNotification({
  message,
  visible,
  onDismiss,
}: ToastNotificationProps) {
  if (!visible) return null

  return (
    <div
      className="fixed bottom-6 start-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 sm:start-auto sm:end-6 sm:translate-x-0"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3 rounded-xl bg-slate-900 px-4 py-3 text-white shadow-xl ring-1 ring-white/10">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded p-1 text-slate-400 hover:text-white"
          aria-label="إغلاق الإشعار"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
