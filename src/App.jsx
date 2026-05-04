import { useEffect, useLayoutEffect, useState } from 'react'
import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import './App.css'
import AppLoader from './components/AppLoader'
import { SplashRevealDoneContext } from './context/SplashRevealDoneContext'
import { BOOKING_URL } from './booking'
import HomePage from './pages/HomePage'
import HotelPage from './pages/HotelPage'
import RoomsPage from './pages/RoomsPage'
import TerritoryPage from './pages/TerritoryPage'
import ContactPage from './pages/ContactPage'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/hotel', label: 'Hotel' },
  { to: '/camere', label: 'Camere' },
  { to: '/territorio', label: 'Territorio' },
  { to: '/contatti', label: 'Contatti' },
]

function App() {
  const location = useLocation()
  const [bootLoaderMounted, setBootLoaderMounted] = useState(true)
  const [showBootLoader, setShowBootLoader] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [footerEmail, setFooterEmail] = useState('')
  const [isNarrowViewport, setIsNarrowViewport] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 768px)').matches,
  )
  const reducePresentationMotion = useReducedMotion()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    const id = requestAnimationFrame(() => setMenuOpen(false))
    return () => cancelAnimationFrame(id)
  }, [location.pathname])

  useEffect(() => {
    const html = document.documentElement
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      html.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      html.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      html.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const onChange = () => setIsNarrowViewport(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!bootLoaderMounted) return undefined
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [bootLoaderMounted])

  useEffect(() => {
    let cancelled = false
    const minMs = reducePresentationMotion ? 280 : 1180
    const t0 = typeof performance !== 'undefined' ? performance.now() : 0

    const loadPromise =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise((resolve) =>
            window.addEventListener('load', () => resolve(undefined), { once: true }),
          )

    const fontPromise = document.fonts?.ready ?? Promise.resolve()

    Promise.all([loadPromise, fontPromise]).then(() => {
      if (cancelled) return
      const elapsed =
        typeof performance !== 'undefined' ? performance.now() - t0 : minMs
      const rest = Math.max(0, minMs - elapsed)
      window.setTimeout(() => {
        if (!cancelled) setShowBootLoader(false)
      }, rest)
    })

    return () => {
      cancelled = true
    }
  }, [reducePresentationMotion])

  /** Fallback: se `onExitComplete` non scatta (caso sporadico FM/React), sblocca comunque contenuto dopo l’uscita visiva (~durata transition AppLoader). */
  useEffect(() => {
    if (showBootLoader) return undefined
    const fallbackMs = reducePresentationMotion ? 400 : 720
    const id = window.setTimeout(() => {
      setBootLoaderMounted(false)
    }, fallbackMs)
    return () => window.clearTimeout(id)
  }, [showBootLoader, reducePresentationMotion])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    const frame = requestAnimationFrame(() => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    })

    return () => cancelAnimationFrame(frame)
  }, [location.pathname])

  const pageMotion = reducePresentationMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.08 },
      }
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -14 },
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
      }

  return (
    <>
      <a className="skip-link" href="#main-content">
        Vai al contenuto
      </a>

      <AnimatePresence onExitComplete={() => setBootLoaderMounted(false)}>
        {showBootLoader && (
          <AppLoader key="app-boot" reduceMotion={reducePresentationMotion} />
        )}
      </AnimatePresence>

      <SplashRevealDoneContext.Provider value={!bootLoaderMounted}>
      <div className="app-shell" inert={bootLoaderMounted ? true : undefined}>
      <nav
        className="navbar"
        id="navbar"
        aria-label="Principale"
      >
        <div className="navbar-bar">
          <NavLink end to="/" className="brand-lockup" aria-label="Hotel Bijou — Home">
            <span className="brand-lockup-mark">Bijou</span>
            <span className="brand-lockup-dot" aria-hidden="true">
              ·
            </span>
            <span className="brand-lockup-sub">Saint-Vincent</span>
          </NavLink>

          <div
            id="primary-nav"
            className={`nav-sheet${menuOpen ? ' is-open' : ''}`}
            inert={isNarrowViewport && !menuOpen ? true : undefined}
          >
            <NavLink
              end
              className="nav-sheet-brand nav-only-mobile"
              to="/"
              onClick={() => setMenuOpen(false)}
            >
              <span className="nav-sheet-brand__mark">Bijou</span>
              <span className="nav-sheet-brand__line" aria-hidden="true" />
              <span className="nav-sheet-brand__sub">Saint-Vincent, Valle d&apos;Aosta</span>
            </NavLink>

            <p className="nav-sheet-kicker label">Percorsi</p>

            <div className="nav-sheet-links-panel">
            <ul className="nav-sheet-links" aria-label="Sezioni">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `nav-link${isActive ? ' nav-link--active' : ''}`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            </div>

            <a
              className="nav-cta nav-cta--mobile"
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Prenota
            </a>

            <p className="nav-sheet-tagline">
              <span>Boutique hotel in piazza</span>
              <span className="nav-sheet-tagline__dot" aria-hidden="true">
                ·
              </span>
              <span>Accoglienza di famiglia</span>
            </p>
          </div>

          <div className="navbar-trailing">
            <a
              className="nav-cta nav-cta--desktop"
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Prenota
            </a>
            <button
              type="button"
              className={`nav-toggle${menuOpen ? ' is-active' : ''}`}
              aria-label={menuOpen ? 'Chiudi menu' : 'Apri menu'}
              aria-expanded={menuOpen}
              aria-controls="primary-nav"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>
      <button
        type="button"
        className={`nav-backdrop${menuOpen ? ' is-visible' : ''}`}
        aria-label="Chiudi menu"
        tabIndex={menuOpen ? 0 : -1}
        onClick={() => setMenuOpen(false)}
      />

      <AnimatePresence mode="wait">
        <motion.main
          id="main-content"
          tabIndex={-1}
          key={location.pathname}
          initial={pageMotion.initial}
          animate={pageMotion.animate}
          exit={pageMotion.exit}
          transition={pageMotion.transition}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/hotel" element={<HotelPage />} />
            <Route path="/camere" element={<RoomsPage />} />
            <Route path="/territorio" element={<TerritoryPage />} />
            <Route path="/contatti" element={<ContactPage />} />
          </Routes>
        </motion.main>
      </AnimatePresence>

      <footer className="footer footer--museum" id="prenota">
        <div className="footer__shell">
          <div className="footer__grid">
            <div className="footer__news">
              <h2 className="footer__lead serif">Restiamo in contatto.</h2>
              <p className="footer__lede">
                Novità sulla struttura, sugli eventi in valle e sulle offerte stagionali: lasciaci il tuo indirizzo
                email e sarai ricontattato dalla nostra reception.
              </p>
              <form
                className="footer__news-form"
                onSubmit={(e) => {
                  e.preventDefault()
                  const em = footerEmail.trim()
                  if (!em) return
                  window.location.href = `mailto:info@bijouhotel.it?subject=${encodeURIComponent('Richiesta aggiornamenti — sito')}&body=${encodeURIComponent(`Email: ${em}\n\nVorrei ricevere comunicazioni dall'Hotel Bijou.`)}`
                }}
              >
                <label className="footer__news-hint" htmlFor="footer-news-email">
                  La tua email
                </label>
                <div className="footer__news-row">
                  <input
                    id="footer-news-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder=""
                    value={footerEmail}
                    onChange={(e) => setFooterEmail(e.target.value)}
                  />
                  <button type="submit" className="footer__news-send" aria-label="Invia richiesta tramite email">
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.85"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14M13 7l6 5-6 5"
                      />
                    </svg>
                  </button>
                </div>
              </form>
            </div>

            <nav className="footer__nav-col" aria-label="Percorsi">
              <p className="footer__heading">Esplora</p>
              <ul className="footer__links-list">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) => `footer__link${isActive ? ' footer__link--active' : ''}`}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="footer__nav-col" aria-label="Social e booking">
              <p className="footer__heading">Social & booking</p>
              <ul className="footer__links-list">
                <li>
                  <a
                    href="https://www.facebook.com/pages/category/Hotel/Hotel-Bijou-Saint-Vincent-Pagina-Ufficiale-Albergo-150241625024589/"
                    className="footer__link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a href={BOOKING_URL} className="footer__link" target="_blank" rel="noopener noreferrer">
                    Booking online
                  </a>
                </li>
                <li>
                  <a href="mailto:info@bijouhotel.it" className="footer__link">
                    Email
                  </a>
                </li>
                <li>
                  <a href="tel:+390166510067" className="footer__link">
                    Telefono
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer__divider" aria-hidden />

          <div className="footer__wordmark serif" aria-hidden="true">
            <span className="footer__wordmark-line">Hotel</span>
            <span className="footer__wordmark-line footer__wordmark-line--heavy">Bijou</span>
          </div>

          <div className="footer__meta">
            <div className="footer__meta-left">
              <p>
                Piazza Cavalieri di Vittorio Veneto, 3 · 11027 Saint-Vincent (AO)
                <span className="footer__sep" aria-hidden>
                  {' · '}
                </span>
                Tel. <a href="tel:+390166510067">+39 0166 510067</a>
              </p>
              <p>
                <a href="mailto:info@bijouhotel.it">info@bijouhotel.it</a>
                {' · '}P.IVA IT00167170075{' · '}
                <a href="https://www.bijouhotel.it/" target="_blank" rel="noopener noreferrer">
                  bijouhotel.it
                </a>
              </p>
              <p className="footer__award">
                Riconoscimento HotelsCombined «Recognition of Excellence» (2022) —{' '}
                <a
                  href="https://www.hotelscombined.com/Hotel/Bijou_Saint_Vincent.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  giudizio medio 9,2/10
                </a>
                .
              </p>
              <p className="footer__design-row">
                <a
                  href="https://devmichelbranche.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__design-link"
                >
                  Design by Michel Branche
                </a>
              </p>
            </div>
            <p className="footer__copyright">
              © {new Date().getFullYear()} Hotel Bijou · Saint-Vincent (AO)
            </p>
          </div>
        </div>
      </footer>
      </div>
      </SplashRevealDoneContext.Provider>
    </>
  )
}

export default App
