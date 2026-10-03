export function parseShareTokenFromUrl(): string | null {
  if (typeof window === 'undefined') return null

  const hashMatch = window.location.hash.match(/^#\/share\/([a-f0-9]{32})$/i)
  if (hashMatch) return hashMatch[1]

  const pathMatch = window.location.pathname.match(/\/share\/([a-f0-9]{32})$/i)
  if (pathMatch) return pathMatch[1]

  return null
}

export function subscribeShareRoute(onToken: (token: string | null) => void) {
  const emit = () => onToken(parseShareTokenFromUrl())
  emit()
  window.addEventListener('hashchange', emit)
  window.addEventListener('popstate', emit)
  return () => {
    window.removeEventListener('hashchange', emit)
    window.removeEventListener('popstate', emit)
  }
}
