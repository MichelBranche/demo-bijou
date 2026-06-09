import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollExpandHero from '../components/ScrollExpandHero'
import { SplashRevealDoneContext } from '../context/SplashRevealDoneContext'
import ReputationShowcase from '../components/ReputationShowcase'
import { bijouImages } from '../assets/images'
import { isMobileViewport, prefersReducedMotion } from '../motionPrefs'
import { usePageSeo } from '@/hooks/usePageSeo'
import { absoluteUrl, defaultSeoImage } from '@/seo/siteSeo'

const editorialSlides = [
  {
    id: 'hotel',
    label: 'Ospitalità di famiglia',
    title: 'Hotel',
    description:
      'Camino acceso, legni antichi, tessuti naturali e un tocco contemporaneo. Dal soggiorno alla sala colazioni, tutto si apre sul dehors che guarda sulla piazza.',
    cta: 'Scopri l’hotel',
    to: '/hotel',
    image: bijouImages.editorial.hotel,
    alt: 'Ambiente elegante degli spazi comuni dell’Hotel Bijou',
  },
  {
    id: 'rooms',
    label: 'Dove riposare',
    title: 'Camere',
    description:
      'Dalla vista sulla piazza alle stanze più raccolte: sei tipologie, medesimo standard di pulizia e cura.',
    cta: 'Esplora le camere',
    to: '/camere',
    image: bijouImages.editorial.rooms,
    alt: 'Interno luminoso di una camera dell’hotel',
  },
  {
    id: 'area',
    label: 'Riviera delle Alpi',
    title: 'Territorio',
    description:
      'Al centro della Valle d’Aosta, tra Casinò, cure Fons Salutis e percorsi in quota: punto d’appoggio elegante tra benessere, sport e cultura.',
    cta: 'Territorio e dintorni',
    to: '/territorio',
    image: bijouImages.editorial.territory,
    alt: 'Camoscio sulle rocce in Valle d’Aosta, con bosco alpino sullo sfondo',
  },
]

/** px sotto dopo l’unlock — la strip recap non deve comparire prima di uno scroll reale della pagina */
const REPUTATION_SCROLL_REVEAL_PX = 56

function HomePage() {
  usePageSeo({
    title: 'Hotel Bijou · Boutique hotel a Saint-Vincent',
    description:
      "Hotel Bijou a Saint-Vincent, Valle d'Aosta: boutique hotel in piazza con camere curate, colazione locale e accesso comodo a terme, sport e territorio.",
    pathname: '/',
    image: defaultSeoImage,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Hotel',
        name: 'Hotel Bijou',
        url: absoluteUrl('/'),
        image: absoluteUrl('/images/bijou/hero-piazza-saint-vincent.png'),
        telephone: '+39 0166 510067',
        email: 'info@bijouhotel.it',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Piazza Cavalieri di Vittorio Veneto, 3',
          addressLocality: 'Saint-Vincent',
          postalCode: '11027',
          addressRegion: 'AO',
          addressCountry: 'IT',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Hotel Bijou',
        url: absoluteUrl('/'),
      },
    ],
  })

  const horizontalSectionRef = useRef(null)
  const homeStoryGridRef = useRef(/** @type {HTMLDivElement | null} */ (null))
  const splashRevealDone = useContext(SplashRevealDoneContext)
  const routeReducedMotion = prefersReducedMotion()
  const [scrollUnlocked, setScrollUnlocked] = useState(() =>
    typeof window !== 'undefined' ? prefersReducedMotion() : false,
  )

  /** Recensioni sotto hero: solo dopo scroll (mai in primo piano col solo fullscreen hero). */
  const [reputationRevealed, setReputationRevealed] = useState(routeReducedMotion)

  /** Lenis sempre montato sulla Home (start/stop) per fluidità uguale al resto delle pagine. */
  const [homeLenis, setHomeLenis] = useState(() => /** @type {import('lenis').default | null} */ (null))

  const handleHeroCollapse = useCallback(() => {
    setScrollUnlocked(false)
    if (!routeReducedMotion) setReputationRevealed(false)
  }, [routeReducedMotion])

  const handleHeroUnlock = useCallback(() => {
    setScrollUnlocked(true)
  }, [])

  const handleJourneyComplete = useCallback(() => {
    setScrollUnlocked(true)
    setReputationRevealed(true)
  }, [])

  useEffect(() => {
    const nav = document.getElementById('navbar')
    const updateNav = () => {
      if (!nav) return
      const y =
        homeLenis && typeof homeLenis.scroll === 'number' ? homeLenis.scroll : window.scrollY
      nav.classList.toggle('scrolled', y > 50)
    }

    updateNav()
    window.addEventListener('scroll', updateNav, { passive: true })
    if (homeLenis) homeLenis.on('scroll', updateNav)
    return () => {
      window.removeEventListener('scroll', updateNav)
      homeLenis?.off('scroll', updateNav)
    }
  }, [homeLenis])

  useEffect(() => {
    if (routeReducedMotion) return undefined

    const isTouchDevice =
      typeof window !== 'undefined' &&
      (window.matchMedia('(hover: none)').matches || window.innerWidth <= 768)

    const lenis = new Lenis({
      duration: 1.72,
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: isTouchDevice ? 1 : 1.08,
    })

    const tickerCallback = (time) => lenis.raf(time * 1000)
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)
    lenis.stop()

    let cancelled = false
    queueMicrotask(() => {
      if (cancelled) return
      setHomeLenis(lenis)
    })

    return () => {
      cancelled = true
      gsap.ticker.remove(tickerCallback)
      lenis.destroy()
      queueMicrotask(() => {
        setHomeLenis(null)
      })
      ScrollTrigger.refresh()
    }
  }, [routeReducedMotion])

  useEffect(() => {
    const lenis = homeLenis
    if (!lenis || routeReducedMotion) return

    if (scrollUnlocked) {
      lenis.start()
    } else {
      lenis.stop()
      lenis.scrollTo(0, { immediate: true })
    }

    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [scrollUnlocked, homeLenis, routeReducedMotion])

  useEffect(() => {
    if (routeReducedMotion) return undefined
    if (!scrollUnlocked) return undefined
    if (isMobileViewport()) {
      setReputationRevealed(true)
      return undefined
    }

    const readScrollY = () => {
      if (homeLenis && typeof homeLenis.scroll === 'number') return homeLenis.scroll
      if (typeof window === 'undefined') return 0
      return window.scrollY || document.documentElement.scrollTop || 0
    }

    const tryReveal = () => {
      if (readScrollY() >= REPUTATION_SCROLL_REVEAL_PX) setReputationRevealed(true)
    }

    queueMicrotask(tryReveal)

    if (homeLenis) {
      homeLenis.on('scroll', tryReveal)
      return () => {
        homeLenis.off('scroll', tryReveal)
      }
    }

    window.addEventListener('scroll', tryReveal, { passive: true })
    return () => window.removeEventListener('scroll', tryReveal)
  }, [routeReducedMotion, scrollUnlocked, homeLenis])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const horizontalEl = horizontalSectionRef.current
    const reduced = prefersReducedMotion()
    const isDesktop = typeof window !== 'undefined' && window.innerWidth > 768

    if (horizontalEl && reduced) {
      horizontalEl.classList.add('horizontal-static')
    }

    if (reduced) {
      gsap.set('.home-story-reveal', { y: 0, opacity: 1, clearProps: 'all' })
      gsap.set('.home-story-grid', { y: 0, opacity: 1, filter: 'none', clearProps: 'all' })
      gsap.set('.slide-reveal', { y: 0, opacity: 1, clearProps: 'all' })
      return () => {
        horizontalEl?.classList.remove('horizontal-static')
        ScrollTrigger.getAll().forEach((t) => t.kill())
      }
    }

    const ctx = gsap.context(() => {
      const homeStorySection = document.querySelector('.home-story')
      const homeStoryGridEl = homeStoryGridRef.current

      if (homeStorySection && homeStoryGridEl) {
        const storyReveals = gsap.utils.toArray(homeStorySection.querySelectorAll('.home-story-reveal'))

        if (!isDesktop) {
          gsap.set(homeStoryGridEl, {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'none',
            clearProps: 'all',
          })
          if (storyReveals.length) {
            gsap.set(storyReveals, { y: 0, opacity: 1, clearProps: 'all' })
          }
        } else {
          const tl = gsap.timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: {
              trigger: homeStorySection,
              start: 'top 82%',
            },
          })

          tl.fromTo(
            homeStoryGridEl,
            { opacity: 0, y: 40, scale: 0.985, filter: 'blur(12px)' },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
              duration: 0.88,
              onComplete() {
                gsap.set(homeStoryGridEl, { clearProps: 'filter' })
              },
            },
          )

          if (storyReveals.length) {
            gsap.set(storyReveals, { y: 28, opacity: 0 })
            tl.to(
              storyReveals,
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.11,
                onComplete: () => gsap.set(storyReveals, { clearProps: 'willChange' }),
              },
              '-=0.62',
            )
          }
        }
      }

      const horizontalSection = document.querySelector('.horizontal-section')
      const horizontalItems = gsap.utils.toArray('.horizontal-item')
      const canUseHorizontalScroll =
        isDesktop && horizontalSection && horizontalItems.length > 1

      const scrollTween = canUseHorizontalScroll
        ? gsap.to(horizontalItems, {
            xPercent: -100 * (horizontalItems.length - 1),
            ease: 'none',
            scrollTrigger: {
              trigger: horizontalSection,
              pin: true,
              scrub: 1,
              snap: 1 / (horizontalItems.length - 1),
              end: () => `+=${horizontalSection.offsetWidth * 1.55}`,
            },
          })
        : null

      if (scrollTween) {
        gsap.utils.toArray('.parallax-img').forEach((img) => {
          gsap.fromTo(
            img,
            { objectPosition: '0% 50%' },
            {
              objectPosition: '100% 50%',
              ease: 'none',
              scrollTrigger: {
                trigger: img.parentElement,
                containerAnimation: scrollTween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            },
          )
        })
      } else if (isDesktop) {
        gsap.utils.toArray('.parallax-img').forEach((img) => {
          gsap.fromTo(
            img,
            { yPercent: -4 },
            {
              yPercent: 6,
              ease: 'none',
              scrollTrigger: {
                trigger: img.closest('.horizontal-item'),
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          )
        })
      }

      gsap.utils.toArray('.horizontal-item').forEach((item, index) => {
        const revealTargets = item.querySelectorAll('.slide-reveal')
        gsap.set(revealTargets, { y: 24, opacity: 0, willChange: 'transform,opacity' })
        const tl = gsap.timeline({ paused: true })
        tl.to(revealTargets, {
          y: 0,
          opacity: 1,
          duration: 0.72,
          ease: 'power3.out',
          stagger: 0.12,
          onComplete: () => gsap.set(revealTargets, { clearProps: 'willChange' }),
        })

        if (scrollTween) {
          ScrollTrigger.create({
            trigger: item,
            containerAnimation: scrollTween,
            start: 'left center+=160',
            end: 'right center-=80',
            onEnter: () => tl.play(),
            onEnterBack: () => tl.play(),
            onLeaveBack: () => tl.pause(0),
          })
        } else if (isDesktop) {
          ScrollTrigger.create({
            trigger: item,
            start: 'top 80%',
            onEnter: () => tl.play(),
            onEnterBack: () => tl.play(),
            onLeaveBack: () => tl.pause(0),
          })
        } else {
          gsap.set(revealTargets, { y: 0, opacity: 1, clearProps: 'transform' })
        }

        if (index === 0) {
          tl.play(0)
        }
      })
    })

    return () => {
      horizontalEl?.classList.remove('horizontal-static')
      ctx.revert()
    }
  }, [])

  const heroAlt =
    'Hotel Bijou sulla piazza centrale di Saint-Vincent — facciata, fontana, giardino e montagne sullo sfondo'

  return (
    <>
      <ScrollExpandHero
        splashRevealDone={splashRevealDone}
        lenis={routeReducedMotion ? null : homeLenis}
        bgImageSrc={bijouImages.heroBg}
        bgVideoSrc={bijouImages.heroBgVideo}
        mediaImageSrc={bijouImages.hero}
        mediaAlt={heroAlt}
        title="Hotel Bijou"
        subtitle={
          <>
            <span className="scroll-expand-sub__place">Saint‑Vincent</span>
            <span className="scroll-expand-sub__sep" aria-hidden="true">
              ,{' '}
            </span>
            <span className="scroll-expand-sub__region">Valle d&apos;Aosta</span>
          </>
        }
        eyebrowLines={['Boutique hotel', 'Piazza centrale']}
        scrollHint="Scorri per entrare in hotel"
        handoffTargetRef={homeStoryGridRef}
        onUnlock={handleHeroUnlock}
        onCollapse={handleHeroCollapse}
        onJourneyComplete={handleJourneyComplete}
      />

      <section className="home-story" aria-labelledby="home-story-heading">
        <div ref={homeStoryGridRef} className="home-story-grid">
          <span id="home-story-eyebrow" className="label home-story-reveal">
            Identità
          </span>
          <h2 id="home-story-heading" className="home-story-title serif home-story-reveal">
            Un boutique hotel sulla piazza di Saint‑Vincent
          </h2>
          <p className="home-story-text home-story-reveal">
            L’Hotel Bijou affaccia sulla piazza centrale: dalla stessa famiglia da tre generazioni, dopo
            un recente rinnovo offre stanze sobrie, cortile raccolto e spazi comuni dove fermarsi dopo
            una giornata in valle. Qui la Riviera delle Alpi significa climi miti anche d’inverno e aria
            limpida in estate, con Aosta e i sentieri d’altura a pochi minuti.
          </p>
          <p className="home-story-text home-story-reveal home-story-extra">
            Il nostro lavoro quotidiano è farvi trovare biancheria fresca, tessuti sobri, dettaglio curato e
            un&apos;accoglienza domestica che resta difficile da replicare quando partite.
          </p>
          <figure className="home-story-figure home-story-reveal">
            <img
              className="home-story-photo"
              src={bijouImages.editorial.territoryPiazza}
              alt="Piazza centrale di Saint-Vincent vista attraverso un arco in pietra, con palazzi e montagne sullo sfondo"
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
      </section>

      <ReputationShowcase revealed={reputationRevealed} />

      <section className="horizontal-section" ref={horizontalSectionRef}>
        <div
          className="horizontal-container"
          style={{ '--slide-count': editorialSlides.length }}
        >
          {editorialSlides.map((slide) => (
            <article className="horizontal-item" key={slide.id} id={slide.id}>
              <div className="item-grid">
                <div className="item-text">
                  <span className="label slide-reveal">{slide.label}</span>
                  <div className="mask">
                    <h2 className="slide-reveal serif">{slide.title}</h2>
                  </div>
                  <p className="slide-reveal">{slide.description}</p>
                  <Link className="slide-reveal" to={slide.to}>
                    {slide.cta}
                  </Link>
                </div>
                <div className="item-img">
                  <img
                    className="parallax-img"
                    src={slide.image}
                    alt={slide.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default HomePage
