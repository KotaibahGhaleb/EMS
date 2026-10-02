import { DoorOpen, MapPin } from 'lucide-react'
import {
  CORRIDOR,
  FLOOR_ROOMS,
  ROOM_NEUTRAL_TOP,
  getFloorNavForStep,
  type FloorRoomId,
} from '../data/floorPlanNav'
import type { JourneyStep } from '../types/patient'

interface FloorPlanMapProps {
  roomNumber: string
  currentStep: JourneyStep
}

export function FloorPlanMap({ roomNumber, currentStep }: FloorPlanMapProps) {
  const nav = getFloorNavForStep(currentStep, roomNumber)
  const highlight = FLOOR_ROOMS[nav.highlightId]

  const roomList: FloorRoomId[] = ['triage', 'doctor', 'lab', 'pharmacy']

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-base font-bold text-slate-800">خريطة الوصول</h2>
        <span className="inline-flex max-w-[55%] items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{nav.badgeText}</span>
        </span>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
        <svg
          viewBox="0 0 360 260"
          className="h-auto w-full"
          role="img"
          aria-label={nav.ariaLabel}
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
            {roomList.map((id) => {
              const room = FLOOR_ROOMS[id]
              return (
                <rect
                  key={id}
                  x={room.x}
                  y={room.y}
                  width={room.w}
                  height={room.h}
                  rx="4"
                />
              )
            })}
            <rect
              x={ROOM_NEUTRAL_TOP.x}
              y={ROOM_NEUTRAL_TOP.y}
              width={ROOM_NEUTRAL_TOP.w}
              height={ROOM_NEUTRAL_TOP.h}
              rx="4"
            />
          </g>

          <path
            d={nav.pathD}
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
            d={nav.pathD}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="8 6"
            className="animate-path-glow"
          />

          <rect
            x={highlight.x}
            y={highlight.y}
            width={highlight.w}
            height={highlight.h}
            rx="4"
            fill="#ecfdf5"
            stroke="#10b981"
            strokeWidth="3"
            className="animate-pulse-soft"
          />

          <circle
            cx={nav.startMarker.x}
            cy={nav.startMarker.y}
            r="10"
            fill="#0ea5e9"
            stroke="#fff"
            strokeWidth="2"
          />

          {currentStep === 'registration' || currentStep === 'vitals_triage' ? (
            <text
              x={CORRIDOR.entrance.x}
              y="248"
              textAnchor="middle"
              className="fill-slate-600 text-[11px] font-semibold"
            >
              المدخل
            </text>
          ) : null}

          {currentStep === 'discharge' ? (
            <text
              x={CORRIDOR.entrance.x}
              y="248"
              textAnchor="middle"
              className="fill-emerald-700 text-[11px] font-bold"
            >
              المخرج
            </text>
          ) : null}

          <RoomLabel room={FLOOR_ROOMS.triage} doctorRoomNumber={roomNumber} active={nav.highlightId === 'triage'} />
          <text
            x={ROOM_NEUTRAL_TOP.x + ROOM_NEUTRAL_TOP.w / 2}
            y={ROOM_NEUTRAL_TOP.y + ROOM_NEUTRAL_TOP.h / 2 + 4}
            textAnchor="middle"
            className="fill-slate-500 text-[10px] font-medium"
          >
            {ROOM_NEUTRAL_TOP.label}
          </text>
          <RoomLabel room={FLOOR_ROOMS.doctor} doctorRoomNumber={roomNumber} active={nav.highlightId === 'doctor'} />
          <RoomLabel room={FLOOR_ROOMS.lab} doctorRoomNumber={roomNumber} active={nav.highlightId === 'lab'} />
          <RoomLabel room={FLOOR_ROOMS.pharmacy} doctorRoomNumber={roomNumber} active={nav.highlightId === 'pharmacy'} />
        </svg>

        <div className="absolute bottom-3 right-3 flex max-w-[calc(100%-1.5rem)] items-center gap-2 rounded-lg bg-white/90 px-3 py-2 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-sm ring-1 ring-slate-200">
          <DoorOpen className="h-4 w-4 shrink-0 text-sky-600" />
          {nav.instruction}
        </div>
      </div>
    </section>
  )
}

function RoomLabel({
  room,
  doctorRoomNumber,
  active,
}: {
  room: (typeof FLOOR_ROOMS)[FloorRoomId]
  doctorRoomNumber: string
  active: boolean
}) {
  const cx = room.x + room.w / 2
  const cy = room.y + room.h / 2 + (room.subLabel ? -2 : 4)
  const mainLabel = room.id === 'doctor' ? doctorRoomNumber : room.label

  return (
    <>
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        className={
          active
            ? 'fill-emerald-800 text-[13px] font-bold'
            : 'fill-slate-500 text-[10px] font-medium'
        }
      >
        {mainLabel}
      </text>
      {room.subLabel ? (
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          className={active ? 'fill-emerald-700 text-[9px] font-semibold' : 'fill-slate-400 text-[9px]'}
        >
          {room.subLabel}
        </text>
      ) : null}
    </>
  )
}
