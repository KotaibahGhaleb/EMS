import { Sparkles, Trophy } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import {
  ARABIC_KEYBOARD_ROWS,
  evaluateWordleGuess,
  pickWordleAnswer,
  splitArabicLetters,
} from '../../data/wordleWords'

const MAX_ATTEMPTS = 5
const WORD_LENGTH = 5

interface ArabicWordleProps {
  paused: boolean
}

export function ArabicWordle({ paused }: ArabicWordleProps) {
  const [answer] = useState(() => pickWordleAnswer())
  const [guesses, setGuesses] = useState<string[]>(() =>
    Array.from({ length: MAX_ATTEMPTS }, () => ''),
  )
  const [currentRowIndex, setCurrentRowIndex] = useState(0)
  const [rowEvaluations, setRowEvaluations] = useState<
    ('green' | 'yellow' | 'gray')[][]
  >([])
  const [finished, setFinished] = useState<'win' | 'lose' | null>(null)

  const keyStates = useMemo(() => {
    const map = new Map<string, 'green' | 'yellow' | 'gray'>()
    rowEvaluations.forEach((evals, gi) => {
      splitArabicLetters(guesses[gi]).forEach((ch, i) => {
        const rank = evals[i]
        const prev = map.get(ch)
        if (rank === 'green' || (rank === 'yellow' && prev !== 'green')) {
          map.set(ch, rank)
        } else if (!prev) {
          map.set(ch, rank)
        }
      })
    })
    return map
  }, [guesses, rowEvaluations])

  const submitGuess = useCallback(() => {
    if (paused || finished) return
    const rowText = guesses[currentRowIndex]
    if (splitArabicLetters(rowText).length !== WORD_LENGTH) return

    const evals = evaluateWordleGuess(rowText, answer)
    setRowEvaluations((prev) => [...prev, evals])

    if (rowText === answer) {
      setFinished('win')
      return
    }
    if (currentRowIndex + 1 >= MAX_ATTEMPTS) {
      setFinished('lose')
      return
    }
    setCurrentRowIndex((i) => i + 1)
  }, [paused, finished, guesses, currentRowIndex, answer])

  const onKey = (key: string) => {
    if (paused || finished) return
    if (currentRowIndex >= MAX_ATTEMPTS) return

    if (key === '⌫') {
      setGuesses((prev) => {
        const next = [...prev]
        const letters = splitArabicLetters(next[currentRowIndex])
        next[currentRowIndex] = letters.slice(0, -1).join('')
        return next
      })
      return
    }

    if (key === '↵') {
      submitGuess()
      return
    }

    setGuesses((prev) => {
      const next = [...prev]
      const letters = splitArabicLetters(next[currentRowIndex])
      if (letters.length >= WORD_LENGTH) return prev
      next[currentRowIndex] = next[currentRowIndex] + key
      return next
    })
  }

  const getCellLetter = (rowIndex: number, colIndex: number): string => {
    const letters = splitArabicLetters(guesses[rowIndex] ?? '')
    return letters[colIndex] ?? ''
  }

  const isRowSubmitted = (rowIndex: number) => rowIndex < rowEvaluations.length

  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-slate-600">
        خمّن كلمة صحية من 5 أحرف — {MAX_ATTEMPTS} محاولات
      </p>

      <div className="mx-auto grid max-w-xs gap-1.5">
        {Array.from({ length: MAX_ATTEMPTS }, (_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-5 gap-1.5">
            {Array.from({ length: WORD_LENGTH }, (_, colIndex) => {
              const ch = getCellLetter(rowIndex, colIndex)
              const submitted = isRowSubmitted(rowIndex)
              const evals = rowEvaluations[rowIndex]
              const state = submitted ? evals?.[colIndex] : undefined
              const isActiveRow = rowIndex === currentRowIndex && !finished && !submitted

              const cellClass = submitted
                ? state === 'green'
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : state === 'yellow'
                    ? 'border-amber-400 bg-amber-400 text-white'
                    : 'border-slate-400 bg-slate-400 text-white'
                : isActiveRow && ch
                  ? 'border-sky-400 bg-white text-slate-900'
                  : 'border-slate-200 bg-white text-slate-800'

              return (
                <div
                  key={colIndex}
                  className={`flex h-11 items-center justify-center rounded-lg border-2 text-lg font-bold transition ${cellClass}`}
                >
                  {ch}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {finished === 'win' && (
        <p className="flex items-center justify-center gap-2 text-sm font-bold text-emerald-700">
          <Trophy className="h-4 w-4" />
          أحسنت! الكلمة: {answer}
        </p>
      )}
      {finished === 'lose' && (
        <p className="text-center text-sm font-semibold text-slate-600">
          انتهت المحاولات — الكلمة كانت: <span className="text-sky-700">{answer}</span>
        </p>
      )}

      <div className="space-y-1.5">
        {ARABIC_KEYBOARD_ROWS.map((row, i) => (
          <div key={i} className="flex flex-wrap justify-center gap-1">
            {row.map((key) => {
              const st = keyStates.get(key)
              const bg =
                st === 'green'
                  ? 'bg-emerald-500 text-white'
                  : st === 'yellow'
                    ? 'bg-amber-400 text-white'
                    : st === 'gray'
                      ? 'bg-slate-400 text-white'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              return (
                <button
                  key={key}
                  type="button"
                  disabled={paused || Boolean(finished)}
                  onClick={() => onKey(key)}
                  className={`min-w-[2rem] rounded-md px-2 py-2 text-sm font-semibold ${bg} disabled:opacity-50`}
                >
                  {key}
                </button>
              )
            })}
          </div>
        ))}
        <div className="flex justify-center gap-2 pt-1">
          <button
            type="button"
            disabled={paused || Boolean(finished)}
            onClick={() => onKey('⌫')}
            className="rounded-md bg-slate-200 px-4 py-2 text-sm font-semibold disabled:opacity-50"
          >
            ⌫
          </button>
          <button
            type="button"
            disabled={paused || Boolean(finished)}
            onClick={() => onKey('↵')}
            className="inline-flex items-center gap-1 rounded-md bg-sky-600 px-6 py-2 text-sm font-bold text-white disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            إدخال
          </button>
        </div>
      </div>
    </div>
  )
}
