import type { JourneyStep } from '../types/patient'

export type FloorRoomId = 'triage' | 'doctor' | 'lab' | 'pharmacy'

export interface RoomRect {
  id: FloorRoomId
  x: number
  y: number
  w: number
  h: number
  label: string
  subLabel?: string
}

export const CORRIDOR = {
  verticalCenterX: 58,
  horizontalCenterY: 146,
  entrance: { x: 58, y: 212 },
} as const

export const FLOOR_ROOMS: Record<FloorRoomId, RoomRect> = {
  triage: { id: 'triage', x: 88, y: 40, w: 64, h: 72, label: '201', subLabel: 'فرز' },
  doctor: { id: 'doctor', x: 248, y: 40, w: 64, h: 72, label: '204' },
  lab: { id: 'lab', x: 168, y: 176, w: 64, h: 48, label: 'مختبر' },
  pharmacy: { id: 'pharmacy', x: 248, y: 176, w: 64, h: 48, label: 'صيدلية' },
}

/** Neutral top room (not a stage destination in default flow) */
export const ROOM_NEUTRAL_TOP = { x: 168, y: 40, w: 64, h: 72, label: '203' }

function doorBottom(room: RoomRect) {
  return { x: room.x + room.w / 2, y: room.y + room.h }
}

function doorTop(room: RoomRect) {
  return { x: room.x + room.w / 2, y: room.y }
}

function pathFromPoints(points: { x: number; y: number }[]): string {
  if (points.length === 0) return ''
  const [first, ...rest] = points
  return `M ${first.x} ${first.y}${rest.map((p) => ` L ${p.x} ${p.y}`).join('')}`
}

export interface FloorNavView {
  highlightId: FloorRoomId
  badgeText: string
  instruction: string
  pathD: string
  startMarker: { x: number; y: number }
  ariaLabel: string
}

export function getFloorNavForStep(
  step: JourneyStep,
  doctorRoomNumber: string,
): FloorNavView {
  const { verticalCenterX, horizontalCenterY, entrance } = CORRIDOR
  const triage = FLOOR_ROOMS.triage
  const doctor = FLOOR_ROOMS.doctor
  const lab = FLOOR_ROOMS.lab
  const pharmacy = FLOOR_ROOMS.pharmacy

  const triageDoor = doorBottom(triage)
  const doctorDoor = doorBottom(doctor)
  const labDoor = doorTop(lab)
  const pharmacyDoor = doorTop(pharmacy)

  switch (step) {
    case 'registration':
    case 'vitals_triage':
      return {
        highlightId: 'triage',
        badgeText: 'الوجهة الحالية: غرفة الفرز',
        instruction: 'اتبع المسار المضيء للوصول إلى غرفة الفرز',
        pathD: pathFromPoints([
          entrance,
          { x: verticalCenterX, y: horizontalCenterY },
          { x: triageDoor.x, y: horizontalCenterY },
          triageDoor,
        ]),
        startMarker: entrance,
        ariaLabel: 'مسار من المدخل إلى غرفة الفرز',
      }

    case 'waiting_doctor':
      return {
        highlightId: 'doctor',
        badgeText: `الوجهة الحالية: غرفة ${doctorRoomNumber}`,
        instruction: `اتبع المسار المضيء للوصول إلى غرفة ${doctorRoomNumber}`,
        pathD: pathFromPoints([
          triageDoor,
          { x: triageDoor.x, y: horizontalCenterY },
          { x: doctorDoor.x, y: horizontalCenterY },
          doctorDoor,
        ]),
        startMarker: triageDoor,
        ariaLabel: `مسار من الفرز إلى غرفة ${doctorRoomNumber}`,
      }

    case 'lab':
      return {
        highlightId: 'lab',
        badgeText: 'الوجهة الحالية: المختبر',
        instruction: 'اتبع المسار المضيء للوصول إلى المختبر',
        pathD: pathFromPoints([
          doctorDoor,
          { x: doctorDoor.x, y: horizontalCenterY },
          { x: labDoor.x, y: horizontalCenterY },
          labDoor,
        ]),
        startMarker: doctorDoor,
        ariaLabel: 'مسار من غرفة الطبيب إلى المختبر',
      }

    case 'discharge':
    default:
      return {
        highlightId: 'pharmacy',
        badgeText: 'الوجهة الحالية: الصيدلية / المخرج',
        instruction: 'اتبع المسار المضيء للوصول إلى الصيدلية ثم المخرج',
        pathD: pathFromPoints([
          labDoor,
          { x: labDoor.x, y: horizontalCenterY },
          { x: pharmacyDoor.x, y: horizontalCenterY },
          pharmacyDoor,
          { x: pharmacyDoor.x, y: horizontalCenterY },
          { x: verticalCenterX, y: horizontalCenterY },
          entrance,
        ]),
        startMarker: labDoor,
        ariaLabel: 'مسار من المختبر إلى الصيدلية والمخرج',
      }
  }
}
