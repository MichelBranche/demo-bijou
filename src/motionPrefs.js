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
  const lowBandwidth = Number.isFinite(downlink) && downlink > 0 && downlink <= 1.5
  const legacyNetwork = effectiveType === 'slow-2g' || effectiveType === '2g'
  const lowCpu = typeof nav?.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4
  const lowMemory = typeof nav?.deviceMemory === 'number' && nav.deviceMemory <= 4

  return saveData || lowBandwidth || legacyNetwork || lowCpu || lowMemory
}
