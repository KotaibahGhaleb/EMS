import { Eye, EyeOff, RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

const SIZE = 3
const SOLVED = [1, 2, 3, 4, 5, 6, 7, 8, 0]

function countInversions(tiles: number[]) {
  const arr = tiles.filter((t) => t !== 0)
  let inv = 0
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) inv++
    }
  }
  return inv
}

function isSolvable(tiles: number[]) {
  return countInversions(tiles) % 2 === 0
}

function shuffleTiles(): number[] {
  let tiles = [...SOLVED]
  do {
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[tiles[i], tiles[j]] = [tiles[j], tiles[i]]
    }
  } while (!isSolvable(tiles) || tiles.every((t, i) => t === SOLVED[i]))
  return tiles
}

interface TilePuzzleProps {
  paused: boolean
}

export function TilePuzzle({ paused }: TilePuzzleProps) {
  const [tiles, setTiles] = useState<number[]>(() => shuffleTiles())
  const [moves, setMoves] = useState(0)
  const [showOriginal, setShowOriginal] = useState(false)
  const [won, setWon] = useState(false)

  const emptyIndex = tiles.indexOf(0)

  const tryMove = useCallback(
    (index: number) => {
      if (paused || showOriginal || won) return
      const row = Math.floor(index / SIZE)
      const col = index % SIZE
      const er = Math.floor(emptyIndex / SIZE)
      const ec = emptyIndex % SIZE
      const adjacent = Math.abs(row - er) + Math.abs(col - ec) === 1
      if (!adjacent) return
      const next = [...tiles]
      next[emptyIndex] = next[index]
      next[index] = 0
      setTiles(next)
      setMoves((m) => m + 1)
      if (next.every((t, i) => t === SOLVED[i])) setWon(true)
    },
    [paused, showOriginal, won, tiles, emptyIndex],
  )

  useEffect(() => {
    if (paused) setShowOriginal(false)
  }, [paused])

  const reset = () => {
    setTiles(shuffleTiles())
    setMoves(0)
    setWon(false)
    setShowOriginal(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-700">
          عدد الحركات: <span className="tabular-nums text-sky-700">{moves}</span>
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowOriginal((v) => !v)}
            className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200"
          >
            {showOriginal ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showOriginal ? 'إخفاء الأصل' : 'Show Original Image'}
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-800 ring-1 ring-sky-200"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            جديد
          </button>
        </div>
      </div>

      <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl ring-2 ring-slate-200">
        {showOriginal ? (
          <PuzzleFullImage className="h-full w-full" />
        ) : (
          <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-1 bg-slate-200 p-1">
            {tiles.map((tile, index) => {
              if (tile === 0) {
                return <div key={index} className="rounded-md bg-slate-100" />
              }
              const pos = tile - 1
              const row = Math.floor(pos / SIZE)
              const col = pos % SIZE
              return (
                <button
                  key={index}
                  type="button"
                  disabled={paused}
                  onClick={() => tryMove(index)}
                  className="relative overflow-hidden rounded-md ring-1 ring-white/50 transition active:scale-[0.98] disabled:opacity-60"
                  aria-label={`قطعة ${tile}`}
                >
                  <div
                    className="absolute inset-0 bg-no-repeat"
                    style={{
                      background: PUZZLE_BG,
                      backgroundSize: '300% 300%',
                      backgroundPosition: `${(col / (SIZE - 1)) * 100}% ${(row / (SIZE - 1)) * 100}%`,
                    }}
                  />
                  <span className="sr-only">{tile}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {won && !paused && (
        <p className="text-center text-sm font-bold text-emerald-700">أكملت التركيب — رائع! 🌿</p>
      )}
      <p className="text-center text-xs text-slate-500">
        illustration: مشهد طبيعي/صحي مهدئ — اسحب البلاطات بجانب الفراغ
      </p>
    </div>
  )
}

const PUZZLE_BG =
  'linear-gradient(145deg, #0ea5e9 0%, #10b981 45%, #6ee7b7 70%, #ecfdf5 100%)'

function PuzzleFullImage({ className }: { className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ background: PUZZLE_BG }}>
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <svg viewBox="0 0 120 120" className="h-24 w-24 text-white" aria-hidden>
          <path
            fill="currentColor"
            d="M60 95c-8-12-22-22-22-38 0-12 10-22 22-22s22 10 22 22c0 16-14 26-22 38z"
          />
        </svg>
      </div>
      <p className="absolute bottom-3 inset-x-0 text-center text-xs font-medium text-white/90">
        الصورة الأصلية
      </p>
    </div>
  )
}
