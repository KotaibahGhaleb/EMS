import { DoorOpen, MapPin } from 'lucide-react'

interface FloorPlanMapProps {
  roomNumber: string
}

export function FloorPlanMap({ roomNumber }: FloorPlanMapProps) {
  const pathD = 'M 48 220 L 48 140 L 120 140 L 120 88 L 248 88 L 248 140 L 320 140'

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

          {/* Floor outline */}
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

          {/* Corridors */}
          <rect x="40" y="128" width="280" height="36" fill="#e2e8f0" rx="4" />
          <rect x="40" y="128" width="36" height="96" fill="#e2e8f0" rx="4" />

          {/* Rooms */}
          <g fill="#fff" stroke="#94a3b8" strokeWidth="1.5">
            <rect x="88" y="40" width="64" height="72" rx="4" />
            <rect x="168" y="40" width="64" height="72" rx="4" />
            <rect x="248" y="40" width="64" height="72" rx="4" />
            <rect x="168" y="176" width="64" height="48" rx="4" />
            <rect x="248" y="176" width="64" height="48" rx="4" />
          </g>

          {/* Highlight Room 204 */}
          <rect
            x="248"
            y="40"
            width="64"
            height="72"
            rx="4"
            fill="#ecfdf5"
            stroke="#10b981"
            strokeWidth="3"
            className="animate-pulse-soft"
          />

          {/* Path glow underlay */}
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

          {/* Main path */}
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

          {/* Entrance marker */}
          <circle cx="48" cy="220" r="10" fill="#0ea5e9" stroke="#fff" strokeWidth="2" />
          <text x="48" y="248" textAnchor="middle" className="fill-slate-600 text-[11px] font-semibold">
            المدخل
          </text>

          {/* Room label */}
          <text
            x="280"
            y="82"
            textAnchor="middle"
            className="fill-emerald-800 text-[13px] font-bold"
          >
            {roomNumber}
          </text>

          {/* Other room labels */}
          <text x="120" y="82" textAnchor="middle" className="fill-slate-500 text-[10px]">
            201
          </text>
          <text x="200" y="82" textAnchor="middle" className="fill-slate-500 text-[10px]">
            203
          </text>
        </svg>

        <div className="absolute bottom-3 start-3 flex items-center gap-2 rounded-lg bg-white/90 px-3 py-2 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-sm ring-1 ring-slate-200">
          <DoorOpen className="h-4 w-4 text-sky-600" />
          اتبع المسار المضيء من المدخل
        </div>
      </div>
    </section>
  )
}
