import { AlertCircle, Building2, Clock, Eye, HeartPulse, MapPin, User } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { FloorPlanMap } from './FloorPlanMap'
import { APP_NAME } from '../data/mockPatient'
import { getEmergencyShareByToken } from '../services/emergencyShareService'
import type { EmergencyShareSession } from '../types/emergencyShare'

interface RelativeShareDashboardProps {
  token: string
}

const STATUS_LABELS: Record<string, string> = {
  stable: 'مستقر',
  waiting: 'في الانتظار',
  in_treatment: 'قيد المعالجة',
  urgent: 'حرج',
}

export function RelativeShareDashboard({ token }: RelativeShareDashboardProps) {
  const [session, setSession] = useState<EmergencyShareSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [invalid, setInvalid] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await getEmergencyShareByToken(token)
    if (!data) {
      setInvalid(true)
      setSession(null)
    } else {
      setInvalid(false)
      setSession(data)
    }
    setLoading(false)
  }, [token])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    const onUpdate = (e: Event) => {
      const detail = (e as CustomEvent<{ token: string }>).detail
      if (detail?.token === token) void load()
    }
    window.addEventListener('masar-share-updated', onUpdate)
    const poll = window.setInterval(() => void load(), 8000)
    return () => {
      window.removeEventListener('masar-share-updated', onUpdate)
      window.clearInterval(poll)
    }
  }, [token, load])

  if (loading) {
    return (
      <div dir="rtl" className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <p className="text-sm font-medium text-slate-600">جاري تحميل حالة الطوارئ…</p>
      </div>
    )
  }

  if (invalid || !session) {
    return (
      <div dir="rtl" className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-sm rounded-2xl bg-white p-6 text-center shadow-lg ring-1 ring-slate-200">
          <AlertCircle className="mx-auto h-10 w-10 text-amber-500" />
          <h1 className="mt-3 text-lg font-bold text-slate-900">الرابط غير متاح</h1>
          <p className="mt-2 text-sm text-slate-600">
            انتهت صلاحية الرابط أو تم إلغاؤه. اطلب من المريض إرسال دعوة جديدة.
          </p>
        </div>
      </div>
    )
  }

  const expiresAt = new Date(session.expires_at).toLocaleString('ar-SA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-sky-50/80 to-slate-50 pb-10">
      <header className="border-b border-sky-100 bg-white/95 px-4 py-4 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-sky-700">{APP_NAME} — متابعة للأقارب</p>
            <h1 className="text-lg font-bold text-slate-900">حالة الطوارئ المباشرة</h1>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-800">
            <Eye className="h-3.5 w-3.5" />
            عرض فقط
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-4 px-4 py-6">
        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600 text-white">
              <User className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-500">المريض</p>
              <p className="text-base font-bold text-slate-900">{session.patient_name}</p>
              <p className="mt-1 flex items-center gap-1 text-sm text-slate-600">
                <Building2 className="h-3.5 w-3.5 shrink-0" />
                {session.hospital_name}
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-teal-600 p-4 text-white shadow-md">
            <p className="flex items-center gap-1 text-xs font-medium text-sky-100">
              <Clock className="h-3.5 w-3.5" />
              الوقت المتوقع
            </p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums">{session.eta_minutes}</p>
            <p className="text-sm font-semibold text-sky-50">دقيقة</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
            <p className="flex items-center gap-1 text-xs font-medium text-slate-500">
              <HeartPulse className="h-3.5 w-3.5" />
              حالة الفرز
            </p>
            <p className="mt-2 text-sm font-bold leading-snug text-slate-900">
              {session.triage_status_label}
            </p>
            <p className="mt-2 text-xs text-emerald-700">
              {STATUS_LABELS[session.patient_status] ?? session.patient_status}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900 ring-1 ring-amber-100">
          <MapPin className="mb-1 inline h-3.5 w-3.5" /> غرفة/وجهة:{' '}
          <span className="font-bold">{session.room_number || '—'}</span>
          <span className="mx-2">·</span>
          آخر تحديث:{' '}
          {new Date(session.last_synced_at).toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>

        <FloorPlanMap roomNumber={session.room_number} currentStep={session.current_step} />

        <p className="text-center text-xs text-slate-500">
          الرابط آمن وينتهي في {expiresAt}. الموافقة على الخصوصية تمت من قبل المريض عند
          إنشاء المشاركة.
        </p>
      </main>
    </div>
  )
}
