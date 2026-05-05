import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '@/motionPrefs'

/**
 * Lenis + ScrollTrigger: hero on load, sezioni stagger, galleria pin orizzontale, parallax wellness.
 * @param {{ mainRef: import('react').RefObject<HTMLElement | null>, galleryRef: import('react').RefObject<HTMLElement | null> }} opts
 */
export function useHotelPageAnimations({ mainRef, galleryRef }) {
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

    const onResize = () => {
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize)

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(main.querySelectorAll('[data-reveal]'), { opacity: 1, y: 0 })
        const hm = main.querySelectorAll('.hotel-hero__media')
        const hi = main.querySelectorAll('.hotel-hero__media-inner')
        gsap.set(hm, { clearProps: 'clipPath' })
        gsap.set(hi, { scale: 1 })
        return
      }

      const hero = main.querySelector('.hotel-hero')
      if (hero) {
        const parts = hero.querySelectorAll('.hotel-hero__label, .hotel-hero__title, .hotel-hero__lede')
        const medias = hero.querySelectorAll('.hotel-hero__media')
        const inners = hero.querySelectorAll('.hotel-hero__media-inner')

        gsap.set(parts, { opacity: 0, y: 36 })
        gsap.set(inners, { scale: 1.05 })
        gsap.set(medias, { clipPath: 'inset(100% 0% 0% 0%)' })

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.to(parts, { opacity: 1, y: 0, duration: 0.92, stagger: 0.07 }, 0)
        tl.to(medias, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.08, stagger: 0.12 }, 0.1)
        tl.to(inners, { scale: 1, duration: 1.12, stagger: 0.12 }, 0.1)
      }

      main.querySelectorAll('.hotel-block').forEach((section) => {
        const targets = section.querySelectorAll('[data-reveal]')
        if (!targets.length) return
        gsap.set(targets, { opacity: 0, y: 40 })
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration: 0.88,
          ease: 'power3.out',
          stagger: 0.09,
          scrollTrigger: {
            trigger: section,
            start: 'top 86%',
            once: true,
          },
        })
      })

      const gallerySection = galleryRef.current
      if (gallerySection) {
        const masks = gallerySection.querySelectorAll('.hotel-gallery-pin__mask-inner')
        gsap.set(masks, { clipPath: 'inset(0 100% 0 0)' })
        gsap.to(masks, {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.05,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: gallerySection,
            start: 'top 88%',
            once: true,
          },
        })

        const mm = gsap.matchMedia()
        mm.add('(min-width: 768px)', () => {
          const track = gallerySection.querySelector('.hotel-gallery-pin__track')
          const viewport = gallerySection.querySelector('.hotel-gallery-pin__viewport')
          const sticky = gallerySection.querySelector('.hotel-gallery-pin__sticky')
          if (!track || !viewport || !sticky) return undefined

          const tween = gsap.to(track, {
            x: () => -(Math.max(0, track.scrollWidth - viewport.clientWidth)),
            ease: 'none',
            scrollTrigger: {
              trigger: gallerySection,
              start: 'top top',
              end: () =>
                `+=${Math.max(520, track.scrollWidth - viewport.clientWidth + window.innerHeight * 0.35)}`,
              pin: sticky,
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          })
          return () => tween.kill()
        })
      }

      const wellness = main.querySelector('.hotel-wellness-split')
      const wellnessImg = wellness?.querySelector('.hotel-wellness-split__media img')
      if (wellness && wellnessImg) {
        gsap.fromTo(
          wellnessImg,
          { yPercent: 5 },
          {
            yPercent: -5,
            ease: 'none',
            scrollTrigger: {
              trigger: wellness,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      }
    }, main)

    let disposeCardHover = () => {}
    if (!reduced) {
      const accessCard = main.querySelector('.hotel-access-card')
      if (accessCard) {
        gsap.set(accessCard, { transformOrigin: 'center center' })
        const hoverTween = gsap.to(accessCard, {
          scale: 1.02,
          y: -2,
          duration: 0.38,
          ease: 'power2.out',
          paused: true,
        })
        const onEnter = () => hoverTween.play()
        const onLeave = () => hoverTween.reverse()
        accessCard.addEventListener('mouseenter', onEnter)
        accessCard.addEventListener('mouseleave', onLeave)
        disposeCardHover = () => {
          accessCard.removeEventListener('mouseenter', onEnter)
          accessCard.removeEventListener('mouseleave', onLeave)
          hoverTween.kill()
        }
      }
    }

    return () => {
      disposeCardHover()
      ctx.revert()
      window.removeEventListener('resize', onResize)
      if (lenis) {
        lenis.destroy()
        gsap.ticker.remove(tickerCb)
      } else {
        window.removeEventListener('scroll', syncNavScroll)
      }
    }
  }, [galleryRef, mainRef])
}
