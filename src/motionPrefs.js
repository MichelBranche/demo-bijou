/** @returns {boolean} Viewport mobile (≤768px) */
export function isMobileViewport() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 768px)').matches
}

/** @returns {boolean} User prefers minimal / no motion */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false

  const reducedBySystem = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reducedBySystem) return true

  // Fallback automatico per device/reti deboli: meglio layout stabile che animazioni rotte.
  const nav = typeof navigator !== 'undefined' ? navigator : null
  const conn = nav?.connection
  const saveData = Boolean(conn?.saveData)
  const effectiveType = conn?.effectiveType ?? ''
  const downlink = Number(conn?.downlink ?? 10)
  const lowBandwidth = Number.isFinite(downlink) && downlink > 0 && downlink <= 0.8
  const legacyNetwork = effectiveType === 'slow-2g' || effectiveType === '2g'

  // Non usare CPU/RAM come discriminante: su molti desktop moderni falserebbe il risultato.
  return saveData || lowBandwidth || legacyNetwork
}
