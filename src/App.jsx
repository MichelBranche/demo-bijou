import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import './App.css'
import AppLoader from './components/AppLoader'
import { SplashRevealDoneContext } from './context/SplashRevealDoneContext'
import Navbar from './components/hotel/Navbar'
import Footer from './components/hotel/Footer'
import HomePage from './pages/HomePage'
import HotelPage from './pages/HotelPage'
import RoomsPage from './pages/RoomsPage'
import TerritoryPage from './pages/TerritoryPage'
import ContactPage from './pages/ContactPage'

function App() {
  const location = useLocation()
  const [bootLoaderMounted, setBootLoaderMounted] = useState(true)
  const [showBootLoader, setShowBootLoader] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isNarrowViewport, setIsNarrowViewport] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 768px)').matches,
  )
  const reducePresentationMotion = useReducedMotion()
  const menuOpenRef = useRef(menuOpen)

  useLayoutEffect(() => {
    menuOpenRef.current = menuOpen
  }, [menuOpen])

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
      if (!menuOpenRef.current) {
        document.body.style.overflow = prevOverflow
      }
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
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} isNarrowViewport={isNarrowViewport} />

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

      <Footer />
      </div>
      </SplashRevealDoneContext.Provider>
    </>
  )
}

export default App
