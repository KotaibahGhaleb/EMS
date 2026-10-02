import type { JourneyStep, PatientJourney } from '../types/patient'

export const HOSPITAL_NAME = 'مستشفى الملك فهد — قسم الطوارئ'
export const SAHAFA_HOSPITAL_NAME = 'مستشفى مسار — فرع الصحافة (طوارئ)'
export const PATIENT_NAME = 'أحمد محمد العتيبي'
export const APP_NAME = 'مسار'

export const STEP_ORDER: JourneyStep[] = [
  'registration',
  'vitals_triage',
  'waiting_doctor',
  'lab',
  'discharge',
]

export const STEP_LABELS: Record<JourneyStep, string> = {
  registration: 'اكتمل التسجيل',
  vitals_triage: 'العلامات الحيوية / الفرز',
  waiting_doctor: 'انتظار الطبيب',
  lab: 'المختبر',
  discharge: 'الخروج',
}

export const WAIT_MINUTES_BY_STEP: Record<JourneyStep, number> = {
  registration: 45,
  vitals_triage: 40,
  waiting_doctor: 35,
  lab: 20,
  discharge: 5,
}

export const initialJourney: PatientJourney = {
  currentStep: 'waiting_doctor',
  estimatedWaitMinutes: 35,
  roomNumber: '204',
  status: 'waiting',
}
