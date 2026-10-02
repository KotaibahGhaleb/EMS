export type CapacityLevel = 'green' | 'yellow' | 'red'

export interface CapacityZone {
  id: string
  name: string
  bedsUsed: number
  bedsTotal: number
  level: CapacityLevel
  waitMinutes: number
}

export const capacityZones: CapacityZone[] = [
  {
    id: 'triage',
    name: 'فرز الطوارئ',
    bedsUsed: 12,
    bedsTotal: 20,
    level: 'yellow',
    waitMinutes: 25,
  },
  {
    id: 'resus',
    name: 'الإنعاش',
    bedsUsed: 4,
    bedsTotal: 5,
    level: 'red',
    waitMinutes: 0,
  },
  {
    id: 'fast',
    name: 'المسار السريع',
    bedsUsed: 8,
    bedsTotal: 16,
    level: 'green',
    waitMinutes: 12,
  },
  {
    id: 'peds',
    name: 'طوارئ الأطفال',
    bedsUsed: 9,
    bedsTotal: 12,
    level: 'yellow',
    waitMinutes: 30,
  },
  {
    id: 'obs',
    name: 'الملاحظة',
    bedsUsed: 18,
    bedsTotal: 20,
    level: 'red',
    waitMinutes: 55,
  },
  {
    id: 'minor',
    name: 'إجراءات بسيطة',
    bedsUsed: 3,
    bedsTotal: 10,
    level: 'green',
    waitMinutes: 8,
  },
]

export const levelStyles: Record<
  CapacityLevel,
  { label: string; cell: string; dot: string }
> = {
  green: {
    label: 'طاقة متاحة',
    cell: 'bg-emerald-500/90 hover:bg-emerald-500',
    dot: 'bg-emerald-300',
  },
  yellow: {
    label: 'ازدحام متوسط',
    cell: 'bg-amber-400/95 hover:bg-amber-400',
    dot: 'bg-amber-200',
  },
  red: {
    label: 'طاقة حرجة',
    cell: 'bg-red-500/95 hover:bg-red-500',
    dot: 'bg-red-300',
  },
}
