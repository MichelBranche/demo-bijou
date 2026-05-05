import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { prefersReducedMotion } from '../motionPrefs'

const REWIND_DURATION_MS = 1150

/** Rotella → target progress (smooth follow in RAF evita gli “scalini”) */
const WHEEL_MULTIPLIER = 0.00115
const TOUCH_GAIN_UP = 0.0082
const TOUCH_GAIN_DOWN = 0.0049

/** Risposta interpolata (circa equivalente ~14/s con dt regolato) */
const SMOOTH_LAMBDA = 15

/** Nessuna tween intermediaria sugli overlay: dipende solo da `progress` al frame corrente */
const SNAP_TRANSITION = { type: 'tween', duration: 0 }

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

/**
 * Scroll-expansion hero — Vite + React.
 * Richiede un’istanza Lenis sempre viva sulla Home: fermata mentre la hero “chiude”, attiva dopo l’unlock.
 */
export default function ScrollExpandHero({
  /**
   * `false` finché lo splash iniziale non ha finito l’uscita; la tipografia resta nascosta e l’ingresso GSAP parte solo qui.
   * Default `true` se la hero è usata senza contesto splash.
   */
  splashRevealDone = true,
  /** Istanza Lenis dalla Home (`null` finché non inizializzata) */
  lenis,
  bgImageSrc,
  mediaImageSrc,
  mediaAlt,
  title,
  subtitle,
  eyebrowLines,
  scrollHint,
  onUnlock,
  onCollapse,
}) {
  const reduced = prefersReducedMotion()
  const onUnlockRef = useRef(onUnlock)
  const onCollapseRef = useRef(onCollapse)
  useEffect(() => {
    onUnlockRef.current = onUnlock
  }, [onUnlock])
  useEffect(() => {
    onCollapseRef.current = onCollapse
  }, [onCollapse])

  const [progress, setProgress] = useState(reduced ? 1 : 0)
  const progressRef = useRef(reduced ? 1 : 0)
  const progressTargetRef = useRef(reduced ? 1 : 0)

  const smoothRafRef = useRef(0)
  const smoothTimeRef = useRef(0)
  const rewindRafRef = useRef(0)

  const unlockedRef = useRef(reduced)
  const reversingRef = useRef(false)

  const [fullyExpanded, setFullyExpanded] = useState(reduced)
  const fullyExpandedRef = useRef(reduced)

  const hasUserScrolledAwayRef = useRef(false)

  /** Evita il flash dell’hint mentre la hero chiude animata */
  const [suppressScrollHint, setSuppressScrollHint] = useState(false)

  const [isMobileState, setIsMobileState] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false,
  )

  const scrollExpandRootRef = useRef(/** @type {HTMLDivElement | null} */ (null))
  const scrollCueRootRef = useRef(/** @type {HTMLDivElement | null} */ (null))
  const typeRootRef = useRef(/** @type {HTMLDivElement | null} */ (null))
  const lineLeftRef = useRef(/** @type {HTMLSpanElement | null} */ (null))
  const lineRestRef = useRef(/** @type {HTMLSpanElement | null} */ (null))
  const typeSubRef = useRef(/** @type {HTMLParagraphElement | null} */ (null))
  const typeEyebrowRef = useRef(/** @type {HTMLParagraphElement | null} */ (null))

  /** Ingresso tipografia dopo lo splash (o subito se `splashRevealDone` è già true). */
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || reduced) return undefined
    const root = typeRootRef.current
    if (!root) return undefined

    const targets = gsap.utils
      .toArray(
        root.querySelectorAll('.scroll-expand-line--left, .scroll-expand-line--rest, .scroll-expand-sub'),
      )
      .concat(gsap.utils.toArray(root.querySelectorAll('.scroll-expand-eyebrow')))
      .filter((n) => n instanceof HTMLElement)

    if (!targets.length) return undefined

    if (!splashRevealDone) {
      gsap.set(targets, { opacity: 0, filter: 'blur(10px)' })
      return undefined
    }

    // `fromTo` con fine esplicito: alcuni ambienti Strict/revert lasciavano opacity a 0; niente `y` per non
    // scontrarsi con lo slide su `transform`/`x`.
    gsap.killTweensOf(targets)
    const tl = gsap.fromTo(
      targets,
      { opacity: 0, filter: 'blur(10px)' },
      {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.05,
        ease: 'power3.out',
        stagger: 0.14,
        immediateRender: true,
        onComplete: () => {
          gsap.set(targets, { opacity: 1, clearProps: 'filter' })
        },
      },
    )

    return () => {
      tl.kill()
      gsap.killTweensOf(targets)
    }
  }, [reduced, splashRevealDone])

  /** Scorrevolezza delle righe legata allo stesso progress della hero (equivale ai vecchi translateX inline). */
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return undefined
    const amp = isMobileState ? 0 : 18
    const slidePx = reduced ? amp : progress * amp
    const pairs = /** @type {const} */ ([
      [lineLeftRef.current, -slidePx],
      [lineRestRef.current, slidePx],
      [typeSubRef.current, -slidePx * 0.58],
      [typeEyebrowRef.current, slidePx * 0.38],
    ])
    for (const [el, offsetVw] of pairs) {
      if (!el) continue
      gsap.set(el, {
        x: `${offsetVw.toFixed(2)}vw`,
        force3D: true,
        overwrite: false,
      })
    }
  }, [progress, isMobileState, reduced])

  useLayoutEffect(() => {
    if (reduced || fullyExpanded || suppressScrollHint || !scrollHint) return undefined

    const root = scrollCueRootRef.current
    const motionEl = root?.querySelector('.scroll-expand-scroll-cue__motion')
    if (!motionEl || !(motionEl instanceof Element)) return undefined

    const ctx = gsap.context(() => {
      gsap.fromTo(
        motionEl,
        { y: 0, opacity: 0.72 },
        {
          y: 12,
          opacity: 1,
          duration: 1,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        },
      )
    }, root)

    return () => ctx.revert()
  }, [reduced, fullyExpanded, suppressScrollHint, scrollHint])

  useEffect(() => {
    const onResize = () => setIsMobileState(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const cancelSmoothing = useCallback(() => {
    if (smoothRafRef.current) {
      cancelAnimationFrame(smoothRafRef.current)
      smoothRafRef.current = 0
    }
    smoothTimeRef.current = 0
  }, [])

  const cancelRewind = useCallback(() => {
    if (rewindRafRef.current) {
      cancelAnimationFrame(rewindRafRef.current)
      rewindRafRef.current = 0
    }
  }, [])

  /** Allinea stato React/ref con `progress` e gestisce unlock/expansion badge */
  const applyProgressVisual = useCallback((pRaw) => {
    const p = Math.min(Math.max(pRaw, 0), 1)
    progressRef.current = p
    setProgress(p)

    const open = p >= 1 - 1e-5
    if (open !== fullyExpandedRef.current) {
      fullyExpandedRef.current = open
      setFullyExpanded(open)
    }

    if (open && !unlockedRef.current && !reversingRef.current) {
      unlockedRef.current = true
      onUnlockRef.current?.()
    }
    if (!open && unlockedRef.current) {
      unlockedRef.current = false
    }
  }, [])

  const bumpTarget = useCallback((delta) => {
    progressTargetRef.current = Math.min(1, Math.max(0, progressTargetRef.current + delta))
  }, [])

  const runSmoothing = useCallback(() => {
    const tick = (now) => {
      const prevT = smoothTimeRef.current
      smoothTimeRef.current = now
      const dtMs = prevT ? Math.min(48, now - prevT) : 16.67
      const dt = dtMs / 1000
      const cur = progressRef.current
      const tgt = progressTargetRef.current
      let diff = tgt - cur

      if (Math.abs(diff) < 0.00006) {
        applyProgressVisual(tgt)
        smoothRafRef.current = 0
        smoothTimeRef.current = 0
        return
      }

      const alpha = 1 - Math.exp(-SMOOTH_LAMBDA * dt)
      let next = cur + diff * alpha

      if (diff > 0 && next >= tgt - 2e-5) next = tgt
      if (diff < 0 && next <= tgt + 2e-5) next = tgt

      applyProgressVisual(next)

      smoothRafRef.current = requestAnimationFrame(tick)
    }

    if (!smoothRafRef.current) smoothRafRef.current = requestAnimationFrame(tick)
  }, [applyProgressVisual])

  const finishReverse = useCallback(() => {
    reversingRef.current = false
    cancelRewind()
    progressTargetRef.current = 0
    applyProgressVisual(0)
    hasUserScrolledAwayRef.current = false
    setSuppressScrollHint(false)
  }, [applyProgressVisual, cancelRewind])

  const startReverse = useCallback(() => {
    if (reduced || reversingRef.current) return
    if (progressRef.current < 0.04) return

    cancelSmoothing()
    cancelRewind()

    setSuppressScrollHint(true)
    reversingRef.current = true
    unlockedRef.current = false

    progressTargetRef.current = progressRef.current
    const from = Math.min(1, Math.max(0, progressRef.current))
    const t0 = typeof performance !== 'undefined' ? performance.now() : 0

    onCollapseRef.current?.()

    const step = (nowFrame) => {
      const elapsed = typeof performance !== 'undefined' ? nowFrame - t0 : 0
      const u = Math.min(1, elapsed / REWIND_DURATION_MS)
      const e = easeInOutCubic(u)
      const p = from * (1 - e)
      applyProgressVisual(p)

      if (u >= 1) {
        rewindRafRef.current = 0
        finishReverse()
        return
      }
      rewindRafRef.current = requestAnimationFrame(step)
    }

    rewindRafRef.current = requestAnimationFrame(step)
  }, [reduced, cancelSmoothing, cancelRewind, applyProgressVisual, finishReverse])

  const scrollNearTop = useCallback(() => {
    const ls = typeof lenis?.scroll === 'number' ? lenis.scroll : NaN
    const native =
      typeof window !== 'undefined' ? window.scrollY || document.documentElement.scrollTop || 0 : 0
    const y = Number.isFinite(ls) ? ls : native
    return y <= 20
  }, [lenis])

  /* Torna in cima pagina dopo essere scesi → rivedi l’espansione al contrario */
  useEffect(() => {
    if (reduced || !lenis) return undefined

    const onLenisScroll = (instance) => {
      if (!unlockedRef.current || !fullyExpandedRef.current) return
      if (reversingRef.current) return
      const y = instance.scroll
      if (y > 120) hasUserScrolledAwayRef.current = true
      if (hasUserScrolledAwayRef.current && y < 40) startReverse()
    }

    lenis.on('scroll', onLenisScroll)
    return () => {
      lenis.off('scroll', onLenisScroll)
    }
  }, [reduced, lenis, startReverse])

  useEffect(() => {
    if (reduced) return undefined

    const touchInsideHero = (clientX, clientY) => {
      const root = scrollExpandRootRef.current
      if (!root) return false
      const el = document.elementFromPoint(clientX, clientY)
      return el instanceof Node && root.contains(el)
    }

    const wheelTargetInsideHero = (e) =>
      e.target instanceof Node && !!scrollExpandRootRef.current?.contains(e.target)

    const lockTopWhenClosed = () => {
      if (fullyExpandedRef.current) return
      if (typeof lenis !== 'undefined' && lenis) {
        if (lenis.scroll > 0.5) lenis.scrollTo(0, { immediate: true })
      } else if (typeof window !== 'undefined') window.scrollTo(0, 0)
    }

    let touchLastY = 0
    const touchStartHandler = (e) => {
      const t = e.touches[0]
      if (!t || !touchInsideHero(t.clientX, t.clientY)) return
      touchLastY = t.clientY
    }

    const wheel = (e) => {
      if (!wheelTargetInsideHero(e)) return
      if (reversingRef.current && rewindRafRef.current && e.deltaY > 0) {
        cancelRewind()
        reversingRef.current = false
        unlockedRef.current = false
        setSuppressScrollHint(false)
        if (typeof e.cancelable !== 'boolean' || e.cancelable) e.preventDefault()
        bumpTarget(e.deltaY * WHEEL_MULTIPLIER)
        runSmoothing()
        return
      }

      if (rewindRafRef.current && reversingRef.current) {
        if (typeof e.cancelable !== 'boolean' || e.cancelable) e.preventDefault()
        return
      }

      if (
        fullyExpandedRef.current &&
        !reversingRef.current &&
        e.deltaY < 0 &&
        scrollNearTop()
      ) {
        if (typeof e.cancelable !== 'boolean' || e.cancelable) e.preventDefault()
        startReverse()
        return
      }

      if (fullyExpandedRef.current && !reversingRef.current) return

      if (typeof e.cancelable !== 'boolean' || e.cancelable) e.preventDefault()
      bumpTarget(e.deltaY * WHEEL_MULTIPLIER)
      runSmoothing()
    }

    const touchMoveHandler = (e) => {
      const t = e.touches[0]
      if (!t) return
      const y = t.clientY
      if (!touchInsideHero(t.clientX, t.clientY)) {
        touchLastY = y
        return
      }
      const dy = touchLastY - y

      if (reversingRef.current && rewindRafRef.current && dy < -1.5) {
        cancelRewind()
        reversingRef.current = false
        unlockedRef.current = false
        setSuppressScrollHint(false)
        if (typeof e.cancelable !== 'boolean' || e.cancelable) e.preventDefault()
        bumpTarget(dy * TOUCH_GAIN_UP)
        touchLastY = y
        runSmoothing()
        return
      }

      touchLastY = y

      if (rewindRafRef.current && reversingRef.current) {
        if (typeof e.cancelable !== 'boolean' || e.cancelable) e.preventDefault()
        return
      }

      if (
        fullyExpandedRef.current &&
        !reversingRef.current &&
        scrollNearTop() &&
        dy < -1
      ) {
        if (typeof e.cancelable !== 'boolean' || e.cancelable) e.preventDefault()
        startReverse()
        return
      }

      if (fullyExpandedRef.current && !reversingRef.current) return

      if (typeof e.cancelable !== 'boolean' || e.cancelable) e.preventDefault()
      const factor = dy < 0 ? TOUCH_GAIN_UP : TOUCH_GAIN_DOWN
      bumpTarget(dy * factor)
      runSmoothing()
    }

    window.addEventListener('wheel', wheel, { passive: false, capture: true })
    window.addEventListener('scroll', lockTopWhenClosed, { passive: true })
    window.addEventListener('touchstart', touchStartHandler, { passive: true })
    window.addEventListener('touchmove', touchMoveHandler, { passive: false, capture: true })

    return () => {
      cancelSmoothing()
      cancelRewind()
      if (smoothRafRef.current) cancelAnimationFrame(smoothRafRef.current)
      window.removeEventListener('wheel', wheel, { capture: true })
      window.removeEventListener('scroll', lockTopWhenClosed)
      window.removeEventListener('touchstart', touchStartHandler)
      window.removeEventListener('touchmove', touchMoveHandler, { capture: true })
    }
  }, [
    reduced,
    lenis,
    scrollNearTop,
    startReverse,
    bumpTarget,
    runSmoothing,
    cancelRewind,
    cancelSmoothing,
  ])

  useEffect(() => {
    if (!reduced) return
    fullyExpandedRef.current = true
    unlockedRef.current = true
    onUnlockRef.current?.()
  }, [reduced])

  const pieces = title.trim().split(/\s+/)
  const firstWord = pieces[0] ?? ''
  const restWords = pieces.slice(1).join(' ')

  const mediaWidth = isMobileState ? 300 + progress * 650 : 300 + progress * 1250
  const mediaHeight = isMobileState ? 400 + progress * 200 : 380 + progress * 420

  return (
    <div ref={scrollExpandRootRef} className="scroll-expand-root">
      <section className="scroll-expand-section" aria-label="Introduzione">
        <div className="scroll-expand-fill">
          <motion.div
            className="scroll-expand-bg-layer"
            initial={false}
            animate={{ opacity: Math.max(0, 1 - progress * 1.08) }}
            transition={SNAP_TRANSITION}
          >
            <img
              src={bgImageSrc}
              alt=""
              className="scroll-expand-bg-img"
              decoding="async"
              draggable={false}
            />
            <div className="scroll-expand-bg-veil" aria-hidden />
          </motion.div>

          <div className="scroll-expand-stage-inner">
            <div
              className="scroll-expand-media-slot"
              style={{
                width: `${mediaWidth}px`,
                height: `${mediaHeight}px`,
                maxWidth: '94vw',
                maxHeight: isMobileState ? '78vh' : '82vh',
              }}
            >
              <div className="scroll-expand-media-shell">
                <img
                  src={mediaImageSrc}
                  alt={mediaAlt}
                  className="scroll-expand-media-img"
                  width={1024}
                  height={768}
                  decoding="async"
                  fetchPriority="high"
                  draggable={false}
                />
                <motion.div
                  className="scroll-expand-media-veil"
                  initial={false}
                  animate={{ opacity: Math.max(0.22, 0.58 - progress * 0.28) }}
                  transition={SNAP_TRANSITION}
                  aria-hidden
                />
              </div>
            </div>

            <div ref={typeRootRef} className="scroll-expand-type">
              <h1 className="scroll-expand-heading serif">
                {isMobileState ? (
                  <span className="scroll-expand-line scroll-expand-line--full scroll-expand-type-motion">
                    {title}
                  </span>
                ) : (
                  <>
                    <span
                      ref={lineLeftRef}
                      className="scroll-expand-line scroll-expand-line--left scroll-expand-type-motion"
                    >
                      {firstWord}
                    </span>
                    <span
                      ref={lineRestRef}
                      className="scroll-expand-line scroll-expand-line--rest scroll-expand-type-motion"
                    >
                      {restWords}
                    </span>
                  </>
                )}
              </h1>
              {subtitle && (
                <p ref={typeSubRef} className="scroll-expand-sub scroll-expand-type-motion">
                  {subtitle}
                </p>
              )}
              {!!eyebrowLines?.length && (
                <p
                  ref={typeEyebrowRef}
                  className="scroll-expand-eyebrow label scroll-expand-type-motion"
                >
                  {eyebrowLines.map((line, i) => (
                    <span key={line}>
                      {i > 0 && (
                        <>
                          {' '}
                          <span aria-hidden="true">
                            •
                          </span>{' '}
                        </>
                      )}
                      {line}
                    </span>
                  ))}
                </p>
              )}
            </div>

            {!reduced && !fullyExpanded && !suppressScrollHint && scrollHint ? (
              <div ref={scrollCueRootRef} className="scroll-expand-scroll-cue">
                <p className="scroll-expand-hint label">{scrollHint}</p>
                <div className="scroll-expand-scroll-cue__motion" aria-hidden="true">
                  <svg
                    className="scroll-expand-scroll-cue__svg"
                    viewBox="0 0 24 24"
                    width={28}
                    height={28}
                  >
                    <path
                      d="m6 9 6 6 6-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.15}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  )
}
