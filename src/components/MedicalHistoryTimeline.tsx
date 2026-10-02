import {
  Download,
  FileText,
  HeartPulse,
  Pill,
  ScanLine,
  Stethoscope,
  Syringe,
} from 'lucide-react'
import { useState } from 'react'
import { completedEmergencyVisit } from '../data/medicalHistory'
import { HistoryDetailModal } from './HistoryDetailModal'

type ModalKind = 'lab' | 'scan' | null

interface MedicalHistoryTimelineProps {
  onNotify: (message: string) => void
}

export function MedicalHistoryTimeline({ onNotify }: MedicalHistoryTimelineProps) {
  const visit = completedEmergencyVisit
  const [activeStep, setActiveStep] = useState<string>('registration')
  const [modal, setModal] = useState<ModalKind>(null)

  const handleDownloadReport = () => {
    onNotify('جاري تحميل التقرير الطبي (PDF)...')
  }

  const steps = [
    {
      id: 'registration',
      title: 'التسجيل والعلامات الحيوية',
      subtitle: 'Registration & Vital Signs',
      icon: HeartPulse,
      iconClass: 'bg-sky-100 text-sky-700',
      time: '14:32',
      content: (
        <dl className="grid gap-2 sm:grid-cols-2">
          <VitalItem label="ضغط الدم" value={visit.vitals.bloodPressure} />
          <VitalItem label="نبض" value={`${visit.vitals.heartRate} bpm`} />
          <VitalItem label="الحرارة" value={visit.vitals.temperature} />
          <VitalItem label="SpO₂" value={visit.vitals.spo2} />
        </dl>
      ),
    },
    {
      id: 'consultation',
      title: 'استشارة الطبيب',
      subtitle: 'Doctor Consultation',
      icon: Stethoscope,
      iconClass: 'bg-indigo-100 text-indigo-700',
      time: '15:05',
      content: (
        <div className="space-y-2">
          <p>
            <span className="font-semibold text-slate-800">الطبيب: </span>
            {visit.doctorName}
          </p>
          <p>
            <span className="font-semibold text-slate-800">التشخيص: </span>
            {visit.diagnosis}
          </p>
        </div>
      ),
    },
    {
      id: 'lab',
      title: 'فحوصات المختبر',
      subtitle: 'Lab Tests',
      icon: Syringe,
      iconClass: 'bg-emerald-100 text-emerald-700',
      time: '15:40',
      content: (
        <div className="space-y-3">
          <p className="text-slate-600">{visit.labSummary}</p>
          <button
            type="button"
            onClick={() => setModal('lab')}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
          >
            View Lab Results
          </button>
        </div>
      ),
    },
    {
      id: 'radiology',
      title: 'الأشعة / X-Ray',
      subtitle: 'Radiology / X-Ray',
      icon: ScanLine,
      iconClass: 'bg-violet-100 text-violet-700',
      time: '16:10',
      content: (
        <div className="space-y-3">
          <p className="text-slate-600">{visit.scanSummary}</p>
          <button
            type="button"
            onClick={() => setModal('scan')}
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-bold text-white hover:bg-violet-700"
          >
            View Scan Report
          </button>
        </div>
      ),
    },
    {
      id: 'summary',
      title: 'الملخص النهائي والتقرير',
      subtitle: 'Final Doctor Summary & Medical Report',
      icon: FileText,
      iconClass: 'bg-amber-100 text-amber-800',
      time: '16:45',
      content: (
        <div className="space-y-3">
          <p className="leading-relaxed text-slate-700">{visit.finalSummary}</p>
          <button
            type="button"
            onClick={handleDownloadReport}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
          >
            <Download className="h-4 w-4" />
            تحميل التقرير الطبي
          </button>
        </div>
      ),
    },
    {
      id: 'pharmacy',
      title: 'الصيدلية والأدوية',
      subtitle: 'Pharmacy & Issued Medications',
      icon: Pill,
      iconClass: 'bg-rose-100 text-rose-700',
      time: '17:00',
      content: (
        <ul className="space-y-3">
          {visit.medications.map((med) => (
            <li
              key={med.name}
              className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200"
            >
              <p className="font-bold text-slate-900">{med.name}</p>
              <p className="mt-1 text-sm text-slate-600">الجرعة: {med.dose}</p>
              <p className="mt-1 text-sm font-medium text-sky-800">{med.instructions}</p>
            </li>
          ))}
        </ul>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-sky-100 bg-gradient-to-l from-sky-50 to-white p-5 ring-1 ring-sky-100 sm:p-6">
        <p className="text-xs font-bold text-sky-600">سجل الرحلات السابقة</p>
        <h1 className="mt-1 text-xl font-bold text-slate-900">
          رحلة طوارئ مكتملة
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {visit.visitDate} · {visit.department}
        </p>
        <p className="mt-1 text-xs font-mono text-slate-400">{visit.id}</p>
      </header>

      <ol className="relative space-y-0" aria-label="خط زمني للزيارة">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = activeStep === step.id
          const isLast = index === steps.length - 1

          return (
            <li key={step.id} className="relative flex gap-4 pb-8">
              {!isLast && (
                <span
                  className="absolute start-5 top-12 bottom-0 w-0.5 bg-emerald-200"
                  aria-hidden
                />
              )}

              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md ring-4 ring-emerald-50">
                <Icon className="h-5 w-5" aria-hidden />
              </div>

              <article
                className={`min-w-0 flex-1 rounded-2xl bg-white p-4 shadow-sm ring-1 transition sm:p-5 ${
                  isActive
                    ? 'ring-2 ring-sky-300 shadow-md'
                    : 'ring-slate-200 hover:ring-sky-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveStep(step.id)}
                  className="flex w-full flex-wrap items-start justify-between gap-2 text-start"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${step.iconClass}`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">{step.title}</h2>
                      <p className="text-xs text-slate-500">{step.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 ring-1 ring-emerald-200">
                      مكتمل ✅
                    </span>
                    <span className="text-xs tabular-nums text-slate-400">{step.time}</span>
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isActive ? 'mt-4 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-slate-100 pt-4">{step.content}</div>
                  </div>
                </div>
              </article>
            </li>
          )
        })}
      </ol>

      <HistoryDetailModal
        open={modal === 'lab'}
        title="نتائج المختبر"
        onClose={() => setModal(null)}
      >
        <table className="w-full text-start">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="pb-2 font-semibold">الفحص</th>
              <th className="pb-2 font-semibold">النتيجة</th>
              <th className="pb-2 font-semibold">ملاحظة</th>
            </tr>
          </thead>
          <tbody>
            {visit.labResults.map((row) => (
              <tr key={row.test} className="border-b border-slate-100">
                <td className="py-2 font-medium">{row.test}</td>
                <td className="py-2">{row.result}</td>
                <td className="py-2 text-amber-700">{row.flag ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </HistoryDetailModal>

      <HistoryDetailModal
        open={modal === 'scan'}
        title="تقرير الأشعة"
        onClose={() => setModal(null)}
      >
        <p className="font-semibold text-slate-800">Findings</p>
        <p className="mt-1">{visit.scanReport.finding}</p>
        <p className="mt-4 font-semibold text-slate-800">Impression</p>
        <p className="mt-1">{visit.scanReport.impression}</p>
      </HistoryDetailModal>
    </div>
  )
}

function VitalItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="font-bold text-slate-900">{value}</dd>
    </div>
  )
}
