import { Delete, Trophy } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import {
  ARABIC_KEYBOARD_ROW_1,
  ARABIC_KEYBOARD_ROW_2,
  ARABIC_KEYBOARD_ROW_3,
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

    const insert = key === 'لا' ? 'لا' : key
    setGuesses((prev) => {
      const next = [...prev]
      const combined = next[currentRowIndex] + insert
      if (splitArabicLetters(combined).length > WORD_LENGTH) return prev
      next[currentRowIndex] = combined
      return next
    })
  }

  const letterKeyClass = (key: string) => {
    const st = key === 'لا' ? undefined : keyStates.get(key)
    if (st === 'green') return 'bg-emerald-500 text-white active:bg-emerald-600'
    if (st === 'yellow') return 'bg-amber-400 text-white active:bg-amber-500'
    if (st === 'gray') return 'bg-slate-400 text-white active:bg-slate-500'
    return 'bg-gray-200 text-slate-800 active:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:active:bg-gray-600'
  }

  const baseKeyClass =
    'flex-1 min-w-0 h-10 sm:h-12 flex items-center justify-center rounded text-sm font-semibold disabled:opacity-50'
  const actionKeyClass = `${baseKeyClass} flex-[1.5] bg-gray-300 text-slate-800 active:bg-gray-400 dark:bg-gray-600 dark:text-white dark:active:bg-gray-500`

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

      <div
        dir="rtl"
        className="mx-auto w-full max-w-md select-none px-1"
        aria-label="لوحة مفاتيح عربية"
      >
        {[ARABIC_KEYBOARD_ROW_1, ARABIC_KEYBOARD_ROW_2].map((row, i) => (
          <div key={i} className="my-1 flex w-full items-center justify-center gap-1">
            {row.map((key) => (
              <button
                key={key}
                type="button"
                disabled={paused || Boolean(finished)}
                onClick={() => onKey(key)}
                className={`${baseKeyClass} ${letterKeyClass(key)}`}
              >
                {key}
              </button>
            ))}
          </div>
        ))}

        <div className="my-1 flex w-full items-center justify-center gap-1">
          <button
            type="button"
            disabled={paused || Boolean(finished)}
            onClick={() => onKey('↵')}
            className={`${actionKeyClass} bg-sky-600 text-xs font-bold text-white active:bg-sky-700 sm:text-sm`}
            aria-label="إدخال"
          >
            إدخال
          </button>
          {ARABIC_KEYBOARD_ROW_3.map((key) => (
            <button
              key={key}
              type="button"
              disabled={paused || Boolean(finished)}
              onClick={() => onKey(key)}
              className={`${baseKeyClass} ${letterKeyClass(key)} ${key === 'لا' ? 'text-xs sm:text-sm' : ''}`}
            >
              {key}
            </button>
          ))}
          <button
            type="button"
            disabled={paused || Boolean(finished)}
            onClick={() => onKey('⌫')}
            className={actionKeyClass}
            aria-label="حذف"
          >
            <Delete className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  )
}
