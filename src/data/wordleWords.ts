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

export const ARABIC_KEYBOARD_ROWS = [
  ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج'],
  ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'],
  ['ئ', 'ء', 'ؤ', 'ر', 'ى', 'ة', 'و', 'ز', 'ظ', 'د', 'ذ'],
] as const
