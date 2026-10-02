/** Five-letter Arabic health-themed words for demo Wordle */
export const WORDLE_ANSWERS = ['عناية', 'حيوية', 'معقمة', 'جراحة', 'مريضة'] as const

export const WORDLE_HINT = 'كلمة صحية من 5 أحرف'

export function pickWordleAnswer(): string {
  const idx = Math.floor(Math.random() * WORDLE_ANSWERS.length)
  return WORDLE_ANSWERS[idx]
}

export function splitArabicLetters(word: string): string[] {
  return [...word.normalize('NFC')]
}

export function evaluateWordleGuess(
  guess: string,
  answer: string,
): ('green' | 'yellow' | 'gray')[] {
  const g = splitArabicLetters(guess.padEnd(5, ' ').slice(0, 5))
  const a = splitArabicLetters(answer)
  const result: ('green' | 'yellow' | 'gray')[] = Array(5).fill('gray')
  const answerCounts = new Map<string, number>()

  a.forEach((ch) => answerCounts.set(ch, (answerCounts.get(ch) ?? 0) + 1))

  g.forEach((ch, i) => {
    if (ch === a[i]) {
      result[i] = 'green'
      answerCounts.set(ch, (answerCounts.get(ch) ?? 1) - 1)
    }
  })

  g.forEach((ch, i) => {
    if (result[i] === 'green') return
    const remaining = answerCounts.get(ch) ?? 0
    if (remaining > 0 && a.includes(ch)) {
      result[i] = 'yellow'
      answerCounts.set(ch, remaining - 1)
    }
  })

  return result
}

/** Native mobile Arabic keyboard — rows 1 & 2 (11 keys each) */
export const ARABIC_KEYBOARD_ROW_1 = [
  'ض',
  'ص',
  'ث',
  'ق',
  'ف',
  'غ',
  'ع',
  'ه',
  'خ',
  'ح',
  'ج',
] as const

export const ARABIC_KEYBOARD_ROW_2 = [
  'ش',
  'س',
  'ي',
  'ب',
  'ل',
  'ا',
  'ت',
  'ن',
  'م',
  'ك',
  'ط',
] as const

/** Row 3 letter keys (between Backspace and Enter on mobile layout) */
export const ARABIC_KEYBOARD_ROW_3 = [
  'ئ',
  'ء',
  'ؤ',
  'ر',
  'لا',
  'ى',
  'ة',
  'و',
  'ز',
  'ظ',
  'د',
  'ذ',
] as const
