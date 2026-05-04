import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Lenis from 'lenis'
import gsap from 'gsap'
import { bijouImages } from '../assets/images'
import { BOOKING_URL } from '../booking'
import { prefersReducedMotion } from '../motionPrefs'

const roomImages = bijouImages.rooms

const roomTypes = [
  {
    id: 'singola',
    title: 'Singola',
    text: 'Compatta e curata, pensata per chi viaggia solo o per fermate di pochi giorni.',
    image: roomImages[0],
    alt: 'Camera singola dal tono caldo · Hotel Bijou',
  },
  {
    id: 'doppia-standard',
    title: 'Doppia standard',
    text: 'Equilibrio fra spazio e tranquillità con l’intero pacchetto servizi standard.',
    image: roomImages[1],
    alt: 'Doppia standard con tessuti chiari · Hotel Bijou',
  },
  {
    id: 'doppia-vista',
    title: 'Doppia con vista',
    text: 'Più luce e affaccio continuo sulla piazza maestra del paese.',
    image: roomImages[2],
    alt: 'Doppia affacciata sulla piazza · Hotel Bijou',
  },
  {
    id: 'francese',
    title: 'Camera francese',
    text: 'Atmosfera raccolta: su richiesta in fase di prenotazione predisponiamo testiera in ferro battuto se libera.',
    image: roomImages[3],
    alt: 'Camera francese con dettagli classici · Hotel Bijou',
  },
  {
    id: 'familiare',
    title: 'Camera familiare',
    text: 'Metratura per famiglie con bambini, con disposizione letti concordabile con anticipo sulla prenotazione.',
    image: roomImages[4],
    alt: 'Camera familiare spaziosa · Hotel Bijou',
  },
  {
    id: 'mini-suite',
    title: 'Mini suite',
    text: 'La configurazione più ampia per chi desidera più respiro dopo una giornata in quota.',
    image: roomImages[5],
    alt: 'Mini suite luminosa · Hotel Bijou',
  },
]

/** Servizi comuni raggruppati per tema — sezione dedicata dopo le tipologie. */
const serviceGroups = [
  {
    title: 'Comfort',
    items: ['Aria condizionata'],
  },
  {
    title: 'Connettività e intrattenimento',
    items: ['Wi‑Fi gratuito', 'TV', 'Radio', 'Telefono diretto'],
  },
  {
    title: 'In camera',
    items: ['Frigobar', 'Cassaforte'],
  },
  {
    title: 'Bagno',
    items: ['Bagno privato', 'Asciugacapelli (phon)', 'Vasca o doccia'],
  },
]

/** Ulteriori foto d’ambiente (non abbinate una-a-una alle tipologie). */
const ambientExtra = roomImages.slice(6)

function RoomsPage() {
  useEffect(() => {
    const reduced = prefersReducedMotion()
    const lenis = reduced
      ? null
      : new Lenis({
          duration: 1.55,
          smoothWheel: true,
          smoothTouch: false,
        })

    let tickerCallback = () => {}
    if (lenis) {
      tickerCallback = (time) => lenis.raf(time * 1000)
      gsap.ticker.add(tickerCallback)
      gsap.ticker.lagSmoothing(0)
    }

    const nav = document.getElementById('navbar')
    const onScroll = () => {
      if (!nav) return
      nav.classList.toggle('scrolled', window.scrollY > 20)
    }
    window.addEventListener('scroll', onScroll)

    const revealNodes = document.querySelectorAll('.rooms-reveal')
    let tween = null
    if (reduced) {
      gsap.set(revealNodes, { opacity: 1, y: 0 })
    } else {
      gsap.set(revealNodes, { opacity: 0, y: 22 })
      tween = gsap.to(revealNodes, {
        opacity: 1,
        y: 0,
        duration: 0.72,
        ease: 'power3.out',
        stagger: 0.048,
        delay: 0.1,
      })
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      tween?.kill()
      if (lenis) {
        lenis.destroy()
        gsap.ticker.remove(tickerCallback)
      }
    }
  }, [])

  return (
    <div className="page-shell camere-page">
      <div className="page-hero">
        <span className="label rooms-reveal">Camere</span>
        <h1 className="serif rooms-reveal">Camere: tipologie e servizi</h1>
        <p className="page-intro rooms-reveal">
          Sei configurazioni diverse condividono lo stesso nucleo di servizi in camera (riepilogo sotto), così potete
          confrontare soprattutto superficie vista e carattere della stanza più che liste tecniche diverse. Piccoli animali
          domestici sono ammessi con supplemento e regolamento mostrati in reception. Per ospiti che necessitano di
          camere più agevoli dal punto di vista dell&apos;accessibilità è utile chiamare prima della conferma online:
          la reception blocca piano camera e tipo di bagno coerenti con le unità realmente disponibili al momento della
          richiesta.
        </p>
        <p className="camere-jump rooms-reveal">
          <a className="camere-jump__link" href="#tipologie">
            Tipologie
          </a>
          <span className="camere-jump__dot" aria-hidden="true">
            ·
          </span>
          <a className="camere-jump__link" href="#servizi">
            Servizi in camera
          </a>
        </p>
      </div>

      <figure className="camere-vis-lead rooms-reveal">
        <img
          src={bijouImages.editorial.rooms}
          alt="Ambienti delle camere · Hotel Bijou"
          loading="eager"
          decoding="async"
        />
      </figure>

      <section id="tipologie" className="camere-section" aria-labelledby="camere-tipologie-titolo">
        <header className="camere-section__head rooms-reveal">
          <span className="label">Tipologie</span>
          <h2 id="camere-tipologie-titolo" className="camere-section__title serif">
            Scegli la sistemazione giusta per te
          </h2>
          <p className="camere-section__intro">
            Nel portale di prenotazione trovate le disponibilità aggiornate in tempo reale; per richieste più specifiche
            contattateci dalla pagina{' '}
            <Link to="/contatti" className="camere-inline-link">
              Contatti
            </Link>
            .
          </p>
        </header>

        {roomTypes.map((room, i) => (
          <article
            key={room.id}
            id={room.id}
            className={`camere-tipo rooms-reveal${i % 2 === 1 ? ' camere-tipo--reverse' : ''}`}
          >
            <figure className="camere-tipo__figure">
              <img src={room.image} alt={room.alt} loading={i < 2 ? 'eager' : 'lazy'} decoding="async" />
            </figure>
            <div className="camere-tipo__body">
              <h3 className="camere-tipo__title serif">{room.title}</h3>
              <p className="camere-tipo__text">{room.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section
        id="servizi"
        className="camere-section camere-section--servizi"
        aria-labelledby="camere-servizi-titolo"
      >
        <header className="camere-section__head rooms-reveal">
          <span className="label">Servizi</span>
          <h2 id="camere-servizi-titolo" className="camere-section__title serif">
            Cosa trovi in ogni camera
          </h2>
          <p className="camere-section__intro">
            Lista dei servizi comuni alla struttura; variazioni puntuali sono sempre comunicate al momento
            della conferma quando prenoti.
          </p>
        </header>

        <div className="camere-servizi-cards">
          {serviceGroups.map((group) => (
            <article key={group.title} className="camere-servizio-card rooms-reveal">
              <h3 className="camere-servizio-card__title">{group.title}</h3>
              <ul className="camere-servizio-card__list">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="camere-ambient-extra" aria-label="Altri ambienti">
        <h2 className="camere-ambient-extra__title serif rooms-reveal">
          Ancora qualche dettaglio
        </h2>
        <div className="camere-ambient-extra__grid">
          {ambientExtra.map((src, i) => (
            <img
              key={src}
              className="rooms-reveal"
              src={src}
              alt={`Dettaglio arredi e tessuti ${i + 1} · Hotel Bijou`}
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
      </section>

      <section className="room-cta-band rooms-reveal" aria-label="Prenotazione">
        <p className="room-cta-band__lead serif">Pronto a scegliere la tua camera?</p>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-book-inline btn-book-cta-lg"
        >
          Verifica disponibilità e tariffe
        </a>
      </section>
    </div>
  )
}

export default RoomsPage
