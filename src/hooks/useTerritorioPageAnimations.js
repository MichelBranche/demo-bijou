import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '@/motionPrefs'

/**
 * Lenis + ScrollTrigger: hero on load, reveal sezioni `.territorio-block` con `[data-reveal]`.
 * @param {{ mainRef: import('react').RefObject<HTMLElement | null> }} opts
 */
export function useTerritorioPageAnimations({ mainRef }) {
  useEffect(() => {
    const main = mainRef.current
    if (!main) return undefined

    gsap.registerPlugin(ScrollTrigger)
    const reduced = prefersReducedMotion()
    const nav = document.getElementById('navbar')

    const syncNavScroll = () => {
      if (!nav) return
      const y = window.scrollY ?? document.documentElement.scrollTop
      nav.classList.toggle('scrolled', y > 20)
    }

    let lenis = null
    /** @type {(time: number) => void} */
    let tickerCb = () => {}

    if (!reduced) {
      lenis = new Lenis({
        duration: 1.55,
        smoothWheel: true,
        smoothTouch: false,
      })
      lenis.on('scroll', ({ scroll }) => {
        ScrollTrigger.update()
        if (nav) nav.classList.toggle('scrolled', scroll > 20)
      })
      tickerCb = (time) => lenis.raf(time * 1000)
      gsap.ticker.add(tickerCb)
      gsap.ticker.lagSmoothing(0)
    } else {
      window.addEventListener('scroll', syncNavScroll, { passive: true })
      syncNavScroll()
    }

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)
    let safetyRevealTimeout = 0

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(main.querySelectorAll('[data-reveal]'), { opacity: 1, y: 0 })
        const hm = main.querySelectorAll('.territorio-hero__media')
        const hi = main.querySelectorAll('.territorio-hero__media-inner')
        gsap.set(hm, { clearProps: 'clipPath' })
        gsap.set(hi, { scale: 1 })
        return
      }

      const hero = main.querySelector('.territorio-hero')
      if (hero) {
        const parts = hero.querySelectorAll(
          '.territorio-hero__label, .territorio-hero__title, .territorio-hero__intro, .territorio-hero__after',
        )
        const medias = hero.querySelectorAll('.territorio-hero__media')
        const inners = hero.querySelectorAll('.territorio-hero__media-inner')

        gsap.set(parts, { opacity: 0, y: 32 })
        gsap.set(inners, { scale: 1.05 })
        gsap.set(medias, { clipPath: 'inset(100% 0% 0% 0%)' })

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.to('.territorio-hero__label, .territorio-hero__title, .territorio-hero__intro', {
          opacity: 1,
          y: 0,
          duration: 0.88,
          stagger: 0.07,
        }, 0)
        tl.to(medias, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.05 }, 0.12)
        tl.to(inners, { scale: 1, duration: 1.08 }, 0.12)
        tl.to('.territorio-hero__after', { opacity: 1, y: 0, duration: 0.82 }, '-=0.45')
      }

      main.querySelectorAll('.territorio-block').forEach((section) => {
        const targets = section.querySelectorAll('[data-reveal]')
        if (!targets.length) return
        gsap.set(targets, { opacity: 0, y: 40 })
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration: 0.88,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: 'top 86%',
            once: true,
          },
        })
      })

      // Failsafe per connessioni lente: forza visibilità completa se l'animazione non parte.
      safetyRevealTimeout = window.setTimeout(() => {
        gsap.set(
          main.querySelectorAll(
            '.territorio-hero__label, .territorio-hero__title, .territorio-hero__intro, .territorio-hero__after, [data-reveal]',
          ),
          { opacity: 1, y: 0, clearProps: 'willChange' },
        )
        gsap.set(main.querySelectorAll('.territorio-hero__media'), {
          clipPath: 'inset(0% 0% 0% 0%)',
          clearProps: 'willChange',
        })
        gsap.set(main.querySelectorAll('.territorio-hero__media-inner'), { scale: 1 })
      }, 2400)
    }, main)

    return () => {
      window.clearTimeout(safetyRevealTimeout)
      ctx.revert()
      window.removeEventListener('resize', onResize)
      if (lenis) {
        lenis.destroy()
        gsap.ticker.remove(tickerCb)
      } else {
        window.removeEventListener('scroll', syncNavScroll)
      }
    }
  }, [mainRef])
}
