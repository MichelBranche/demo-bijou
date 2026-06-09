import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { bijouReviewPlatforms } from '../data/bijouReputation'
import { OfficialReviewLogo } from './OfficialReviewLogos'
import { isMobileViewport, prefersReducedMotion } from '../motionPrefs'

function formatRating(n) {
  return n.toLocaleString('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

/**
 * @param {{ revealed?: boolean }} props - `false` mentre la hero è solo fullscreen: strip assente dal viewport.
 */
export default function ReputationShowcase({ revealed = true }) {
  const sectionRef = useRef(/** @type {HTMLElement | null} */ (null))

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !revealed || prefersReducedMotion()) return undefined

    gsap.registerPlugin(ScrollTrigger)
    const section = sectionRef.current
    if (!section) return undefined

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray(section.querySelectorAll('.reputation-strip-reveal'))
      if (!items.length) return

      if (isMobileViewport()) {
        gsap.set(items, { y: 0, opacity: 1, clearProps: 'all' })
        return
      }

      gsap.set(items, { y: 20, opacity: 0, willChange: 'transform,opacity' })
      gsap.fromTo(
        items,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.78,
          ease: 'power3.out',
          stagger: 0.11,
          scrollTrigger: {
            trigger: section,
            start: 'top 88%',
            once: true,
          },
          onComplete: () => gsap.set(items, { clearProps: 'willChange' }),
        },
      )

      queueMicrotask(() => ScrollTrigger.refresh())
    }, section)

    return () => ctx.revert()
  }, [revealed])

  return (
    <section
      ref={sectionRef}
      className={`reputation-strip${!revealed ? ' reputation-strip--concealed' : ''}`}
      aria-label={revealed ? 'Valutazioni degli ospiti sulle piattaforme' : undefined}
      inert={!revealed || undefined}
    >
      <ul className="reputation-strip__list">
        {bijouReviewPlatforms.map((p) => {
          const label = `${p.name}, ${formatRating(p.rating)} su ${p.maxRating}`
          return (
            <li key={p.id} className="reputation-strip__item reputation-strip-reveal">
              <a
                className="reputation-strip__link"
                href={p.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} — apre in una nuova scheda`}
              >
                <OfficialReviewLogo id={p.id} />
                <span className="reputation-strip__meta">
                  <span className="reputation-strip__score">
                    <strong>{formatRating(p.rating)}</strong>
                    <span className="reputation-strip__max">/{p.maxRating}</span>
                  </span>
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
