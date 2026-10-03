import { Share2 } from 'lucide-react'
import { useState } from 'react'
import { ShareWithRelativeModal } from './ShareWithRelativeModal'
import type { CreateEmergencyShareInput } from '../types/emergencyShare'

interface ShareWithRelativeButtonProps {
  shareInput: Omit<CreateEmergencyShareInput, 'sharedWithPhone'>
  onNotify: (message: string) => void
  disabled?: boolean
}

export function ShareWithRelativeButton({
  shareInput,
  onNotify,
  disabled = false,
}: ShareWithRelativeButtonProps) {
  const [shareModalOpen, setShareModalOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setShareModalOpen(true)}
        disabled={disabled}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-gradient-to-l from-sky-50 to-white px-4 py-3.5 text-sm font-bold text-sky-900 shadow-sm ring-1 ring-sky-100 transition hover:from-sky-100/80 hover:to-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Share2 className="h-4 w-4 text-sky-600" />
        مشاركة مع قريب
      </button>

      <ShareWithRelativeModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        shareInput={shareInput}
        onNotify={onNotify}
      />
    </>
  )
}
