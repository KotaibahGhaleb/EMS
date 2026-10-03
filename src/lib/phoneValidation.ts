const DEFAULT_COUNTRY = '966'

/** Normalize Saudi mobile to E.164 (+9665xxxxxxxx). */
export function normalizeSaudiPhone(input: string): { valid: boolean; e164: string; display: string } {
  const digits = input.replace(/\D/g, '')

  let national = digits
  if (national.startsWith(DEFAULT_COUNTRY)) {
    national = national.slice(3)
  }
  if (national.startsWith('0')) {
    national = national.slice(1)
  }

  const valid = /^5\d{8}$/.test(national)
  const e164 = valid ? `+${DEFAULT_COUNTRY}${national}` : ''
  const display = valid ? `0${national}` : input.trim()

  return { valid, e164, display }
}

export function isValidSharePhone(input: string): boolean {
  return normalizeSaudiPhone(input).valid
}
