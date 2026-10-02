export type JourneyStep = 'registration' | 'waiting_doctor' | 'lab' | 'discharge'

export type PatientStatus = 'stable' | 'waiting' | 'in_treatment' | 'urgent'

export interface PatientJourney {
  currentStep: JourneyStep
  estimatedWaitMinutes: number
  roomNumber: string
  status: PatientStatus
}
