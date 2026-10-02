import {
  Activity,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  FileText,
  Pill,
  ScanLine,
  Stethoscope,
  Syringe,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import {
  MEDICAL_HISTORY_HOSPITAL,
  pastEmergencyVisits,
  type CompletedVisit,
} from '../data/medicalHistory'
import { HistoryDetailModal } from './HistoryDetailModal'

type ModalKind = 'lab' | 'scan' | null

interface MedicalHistoryTimelineProps {
  onNotify: (message: string) => void
}

export function MedicalHistoryTimeline({ onNotify }: MedicalHistoryTimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [modal, setModal] = useState<{ visitId: string; kind: ModalKind } | null>(
    null,
  )

  const toggleVisit = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
    setModal(null)
  }

  const modalVisit = modal
    ? pastEmergencyVisits.find((v) => v.id === modal.visitId)
    : null

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-sky-100 bg-gradient-to-l from-sky-50 to-white p-5 ring-1 ring-sky-100 sm:p-6">
        <p className="text-xs font-bold text-sky-600">سجل الرحلات السابقة</p>
        <h1 className="mt-1 text-xl font-bold text-slate-900">{MEDICAL_HISTORY_HOSPITAL}</h1>
        <p className="mt-2 text-sm text-slate-600">
          {pastEmergencyVisits.length} زيارات طوارئ مكتملة — من الأحدث إلى الأقدم
        </p>
      </header>

      <div className="space-y-3" aria-label="زيارات سابقة">
        {pastEmergencyVisits.map((visit) => (
          <VisitAccordionCard
            key={visit.id}
            visit={visit}
            expanded={expandedId === visit.id}
            onToggle={() => toggleVisit(visit.id)}
            onOpenLab={() => setModal({ visitId: visit.id, kind: 'lab' })}
            onOpenScan={() => setModal({ visitId: visit.id, kind: 'scan' })}
            onDownloadReport={() => onNotify('جاري تحميل التقرير الطبي (PDF)...')}
          />
        ))}
      </div>

      <HistoryDetailModal
        open={modal?.kind === 'lab' && Boolean(modalVisit)}
        title="نتائج التحاليل"
        onClose={() => setModal(null)}
      >
        {modalVisit && (
          <table className="w-full text-start">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-2 font-semibold">الفحص</th>
                <th className="pb-2 font-semibold">النتيجة</th>
                <th className="pb-2 font-semibold">ملاحظة</th>
              </tr>
            </thead>
            <tbody>
              {modalVisit.labResults.map((row) => (
                <tr key={row.test} className="border-b border-slate-100">
                  <td className="py-2 font-medium">{row.test}</td>
                  <td className="py-2">{row.result}</td>
                  <td className="py-2 text-amber-700">{row.flag ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </HistoryDetailModal>

      <HistoryDetailModal
        open={modal?.kind === 'scan' && Boolean(modalVisit)}
        title="تقرير الأشعة"
        onClose={() => setModal(null)}
      >
        {modalVisit && (
          <>
            <p className="font-semibold text-slate-800">الموجودات</p>
            <p className="mt-1">{modalVisit.scanReport.finding}</p>
            <p className="mt-4 font-semibold text-slate-800">الانطباع</p>
            <p className="mt-1">{modalVisit.scanReport.impression}</p>
          </>
        )}
      </HistoryDetailModal>
    </div>
  )
}

function VisitAccordionCard({
  visit,
  expanded,
  onToggle,
  onOpenLab,
  onOpenScan,
  onDownloadReport,
}: {
  visit: CompletedVisit
  expanded: boolean
  onToggle: () => void
  onOpenLab: () => void
  onOpenScan: () => void
  onDownloadReport: () => void
}) {
  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 ${
        expanded ? 'border-sky-300 ring-2 ring-sky-100' : 'border-slate-200'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-start gap-3 p-4 text-start sm:p-5"
      >
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-800 ring-1 ring-sky-200">
              <Calendar className="h-3.5 w-3.5" />
              {visit.dateLabel}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
              <Clock className="h-3.5 w-3.5" />
              {visit.visitTime}
            </span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
              {visit.statusLabel}
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-900">{visit.reason}</h2>
        </div>
        {expanded ? (
          <ChevronUp className="mt-1 h-5 w-5 shrink-0 text-sky-600" />
        ) : (
          <ChevronDown className="mt-1 h-5 w-5 shrink-0 text-slate-400" />
        )}
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-4 border-t border-slate-100 px-4 pb-5 pt-4 sm:px-5">
            <TimelineStep
              icon={Activity}
              title="التسجيل والعلامات الحيوية"
              iconClass="bg-sky-100 text-sky-700"
            >
              <p className="text-sm text-slate-700">
                <span className="font-semibold">الضغط:</span> {visit.vitals.bloodPressure}
                {' · '}
                <span className="font-semibold">الحرارة:</span> {visit.vitals.temperature}
                {' · '}
                <span className="font-semibold">النبض:</span> {visit.vitals.heartRate}
              </p>
            </TimelineStep>

            <TimelineStep
              icon={Stethoscope}
              title="استشارة الطبيب والتشخيص"
              iconClass="bg-indigo-100 text-indigo-700"
            >
              <p className="text-sm text-slate-800">
                {visit.doctorName} — عيادة {visit.clinicRoom}
              </p>
              <p className="mt-1 text-sm text-slate-600">{visit.diagnosis}</p>
            </TimelineStep>

            <TimelineStep
              icon={Syringe}
              title="التحاليل والأشعة"
              iconClass="bg-emerald-100 text-emerald-700"
            >
              <p className="mb-3 text-sm text-slate-600">{visit.labSummary}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={onOpenLab}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  <FileText className="h-3.5 w-3.5" />
                  عرض نتائج التحاليل
                </button>
                <button
                  type="button"
                  onClick={onOpenScan}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-xs font-bold text-white hover:bg-violet-700"
                >
                  <ScanLine className="h-3.5 w-3.5" />
                  تقرير الأشعة
                </button>
              </div>
            </TimelineStep>

            <TimelineStep
              icon={FileText}
              title="الملخص النهائي والتقرير"
              iconClass="bg-amber-100 text-amber-800"
            >
              <p className="text-sm leading-relaxed text-slate-700">{visit.finalSummary}</p>
              <p className="mt-2 text-sm text-slate-600">{visit.dischargeInstructions}</p>
              <button
                type="button"
                onClick={onDownloadReport}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                <Download className="h-4 w-4" />
                تحميل التقرير الطبي
              </button>
            </TimelineStep>

            <TimelineStep
              icon={Pill}
              title="الصيدلية والأدوية الموصوفة"
              iconClass="bg-rose-100 text-rose-700"
            >
              <ul className="space-y-2">
                {visit.medications.map((med) => (
                  <li
                    key={med.name}
                    className="rounded-lg bg-slate-50 p-3 text-sm ring-1 ring-slate-200"
                  >
                    <p className="font-bold text-slate-900">{med.name}</p>
                    <p className="text-slate-600">الجرعة: {med.dose}</p>
                    <p className="font-medium text-sky-800">{med.instructions}</p>
                  </li>
                ))}
              </ul>
            </TimelineStep>
          </div>
        </div>
      </div>
    </article>
  )
}

function TimelineStep({
  icon: Icon,
  title,
  iconClass,
  children,
}: {
  icon: typeof Activity
  title: string
  iconClass: string
  children: ReactNode
}) {
  return (
    <div className="flex gap-3">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  )
}
