import { DoorOpen, MapPin } from 'lucide-react'

interface FloorPlanMapProps {
  roomNumber: string
}

/** Corridor centerlines (top-down), aligned with gray L-shaped corridor rects */
const CORRIDOR = {
  verticalCenterX: 58,
  horizontalCenterY: 146,
  entrance: { x: 58, y: 212 },
} as const

const ROOMS = {
  r201: { x: 88, y: 40, w: 64, h: 72, label: '201' },
  r203: { x: 168, y: 40, w: 64, h: 72, label: '203' },
  r204: { x: 248, y: 40, w: 64, h: 72, label: '204' },
  rB1: { x: 168, y: 176, w: 64, h: 48 },
  rB2: { x: 248, y: 176, w: 64, h: 48 },
} as const

function buildNavigationPath(): string {
  const { verticalCenterX, horizontalCenterY, entrance } = CORRIDOR
  const doorX = ROOMS.r204.x + ROOMS.r204.w / 2
  const doorY = ROOMS.r204.y + ROOMS.r204.h
  return `M ${entrance.x} ${entrance.y} L ${verticalCenterX} ${horizontalCenterY} L ${doorX} ${horizontalCenterY} L ${doorX} ${doorY}`
}

export function FloorPlanMap({ roomNumber }: FloorPlanMapProps) {
  const pathD = buildNavigationPath()
  const destCenterX = ROOMS.r204.x + ROOMS.r204.w / 2
  const destCenterY = ROOMS.r204.y + ROOMS.r204.h / 2 - 4

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-base font-bold text-slate-800">خريطة الوصول</h2>
        <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
          <MapPin className="h-3.5 w-3.5" />
          غرفة {roomNumber}
        </span>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
        <svg
          viewBox="0 0 360 260"
          className="h-auto w-full"
          role="img"
          aria-label={`مخطط الطابق مع مسار من المدخل إلى الغرفة ${roomNumber}`}
        >
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect
            x="24"
            y="24"
            width="312"
            height="212"
            rx="8"
            fill="#f8fafc"
            stroke="#cbd5e1"
            strokeWidth="2"
          />

          <text
            x="32"
            y="38"
            className="fill-slate-300 text-[10px] font-medium tracking-wide"
          >
            CR080
          </text>

          <rect x="40" y="128" width="280" height="36" fill="#e2e8f0" rx="4" />
          <rect x="40" y="128" width="36" height="96" fill="#e2e8f0" rx="4" />

          <g fill="#fff" stroke="#94a3b8" strokeWidth="1.5">
            <rect
              x={ROOMS.r201.x}
              y={ROOMS.r201.y}
              width={ROOMS.r201.w}
              height={ROOMS.r201.h}
              rx="4"
            />
            <rect
              x={ROOMS.r203.x}
              y={ROOMS.r203.y}
              width={ROOMS.r203.w}
              height={ROOMS.r203.h}
              rx="4"
            />
            <rect
              x={ROOMS.r204.x}
              y={ROOMS.r204.y}
              width={ROOMS.r204.w}
              height={ROOMS.r204.h}
              rx="4"
            />
            <rect x={ROOMS.rB1.x} y={ROOMS.rB1.y} width={ROOMS.rB1.w} height={ROOMS.rB1.h} rx="4" />
            <rect x={ROOMS.rB2.x} y={ROOMS.rB2.y} width={ROOMS.rB2.w} height={ROOMS.rB2.h} rx="4" />
          </g>

          <path
            d={pathD}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.35"
            filter="url(#glow)"
            className="animate-path-glow"
          />
          <path
            d={pathD}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="8 6"
            className="animate-path-glow"
          />

          <rect
            x={ROOMS.r204.x}
            y={ROOMS.r204.y}
            width={ROOMS.r204.w}
            height={ROOMS.r204.h}
            rx="4"
            fill="#ecfdf5"
            stroke="#10b981"
            strokeWidth="3"
            className="animate-pulse-soft"
          />

          <circle
            cx={CORRIDOR.entrance.x}
            cy={CORRIDOR.entrance.y}
            r="10"
            fill="#0ea5e9"
            stroke="#fff"
            strokeWidth="2"
          />
          <text
            x={CORRIDOR.entrance.x}
            y="248"
            textAnchor="middle"
            className="fill-slate-600 text-[11px] font-semibold"
          >
            المدخل
          </text>

          <text
            x={ROOMS.r201.x + ROOMS.r201.w / 2}
            y={ROOMS.r201.y + ROOMS.r201.h / 2 + 4}
            textAnchor="middle"
            className="fill-slate-500 text-[10px] font-medium"
          >
            {ROOMS.r201.label}
          </text>
          <text
            x={ROOMS.r203.x + ROOMS.r203.w / 2}
            y={ROOMS.r203.y + ROOMS.r203.h / 2 + 4}
            textAnchor="middle"
            className="fill-slate-500 text-[10px] font-medium"
          >
            {ROOMS.r203.label}
          </text>
          <text
            x={destCenterX}
            y={destCenterY}
            textAnchor="middle"
            className="fill-emerald-800 text-[13px] font-bold"
          >
            {roomNumber}
          </text>
        </svg>

        <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-lg bg-white/90 px-3 py-2 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-sm ring-1 ring-slate-200">
          <DoorOpen className="h-4 w-4 text-sky-600" />
          اتبع المسار المضيء من المدخل
        </div>
      </div>
    </section>
  )
}
