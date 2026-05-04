import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Bath,
  BedDouble,
  Brush,
  Coffee,
  Droplets,
  Flame,
  Lock,
  MapPin,
  Medal,
  Sparkles,
  Tv,
  User,
  Wifi,
} from 'lucide-react'
import Lenis from 'lenis'
import gsap from 'gsap'
import '../styles/camere-mockup.css'
import { bijouImages } from '../assets/images'
import { BOOKING_URL } from '../booking'
import { prefersReducedMotion } from '../motionPrefs'

const roomImages = bijouImages.rooms

const roomTypes = [
  {
    id: 'singola',
    title: 'Singola',
    text: 'Compatta e curata, ideale per chi viaggia solo o per soste brevi in valle.',
    image: roomImages[0],
    alt: 'Camera singola dal tono caldo · Hotel Bijou',
    guests: '1 ospite',
    bed: 'Letto singolo',
  },
  {
    id: 'doppia-standard',
    title: 'Doppia standard',
    text: 'Equilibrio fra spazio e tranquillità con il pacchetto servizi Bijou.',
    image: roomImages[1],
    alt: 'Doppia standard con tessuti chiari · Hotel Bijou',
    guests: '2 ospiti',
    bed: 'Letto matrimoniale o twin',
  },
  {
    id: 'doppia-vista',
    title: 'Doppia con vista',
    text: 'Più luce e affaccio sulla piazza centrale di Saint-Vincent.',
    image: roomImages[2],
    alt: 'Doppia affacciata sulla piazza · Hotel Bijou',
    guests: '2 ospiti',
    bed: 'Letto matrimoniale o twin',
  },
  {
    id: 'francese',
    title: 'Camera francese',
    text: 'Atmosfera raccolta; su richiesta testiera in ferro battuto se disponibile.',
    image: roomImages[3],
    alt: 'Camera francese con dettagli classici · Hotel Bijou',
    guests: '2 ospiti',
    bed: 'Letto alla francese',
  },
  {
    id: 'familiare',
    title: 'Camera familiare',
    text: 'Metratura per famiglie: disposizione letti da concordare in prenotazione.',
    image: roomImages[4],
    alt: 'Camera familiare spaziosa · Hotel Bijou',
    guests: 'Fino a 4 ospiti',
    bed: 'Letti multipli',
  },
  {
    id: 'mini-suite',
    title: 'Mini suite',
    text: 'La configurazione più ampia per chi vuole più respiro dopo una giornata in quota.',
    image: roomImages[5],
    alt: 'Mini suite luminosa · Hotel Bijou',
    guests: '2–3 ospiti',
    bed: 'Zona notte + soggiorno',
  },
]

const heroHighlights = [
  { Icon: Medal, label: 'Miglior prezzo garantito' },
  { Icon: Coffee, label: 'Colazione inclusa' },
]

const featuresBar = [
  {
    Icon: MapPin,
    title: 'Posizione ideale',
    text: 'In piazza a Saint-Vincent, comodo per valle e collegamenti.',
  },
  {
    Icon: Sparkles,
    title: 'Ambienti curati',
    text: 'Tessuti naturali, arredi d’epoca e dettaglio quotidiano.',
  },
  {
    Icon: Brush,
    title: 'Pulizia giornaliera',
    text: 'Standard uniforme su tutte le tipologie di camera.',
  },
  {
    Icon: Wifi,
    title: 'Wi‑Fi gratuito',
    text: 'Connessione inclusa in camera e negli spazi comuni.',
  },
]

const amenitiesBar = [
  { Icon: Bath, label: 'Bagno privato' },
  { Icon: Droplets, label: 'Set di cortesia' },
  { Icon: Tv, label: 'TV a schermo piatto' },
  { Icon: Lock, label: 'Cassaforte' },
  { Icon: Flame, label: 'Riscaldamento' },
  { Icon: Coffee, label: 'Bollitore' },
]

const ambientExtra = roomImages.slice(6)
const duoGallery =
  ambientExtra.length >= 2 ? ambientExtra.slice(0, 2) : [roomImages[0], roomImages[1]]

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
        stagger: 0.04,
        delay: 0.08,
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
      <header className="camere-m-hero" aria-labelledby="camere-m-hero-title">
        <div className="camere-m-hero__text">
          <span className="label rooms-reveal">Le nostre camere</span>
          <h1 id="camere-m-hero-title" className="serif camere-m-hero__title rooms-reveal">
            Camere
          </h1>
          <p className="camere-m-hero__lead rooms-reveal">
            Dalla vista sulla piazza alle stanze più raccolte: sei tipologie, stesso standard di pulizia e cura. Piccoli
            animali con supplemento; per esigenze di accessibilità contattate la reception prima di confermare.
          </p>
          <ul className="camere-m-hero__highlights">
            {heroHighlights.map(({ Icon, label }) => (
              <li key={label} className="camere-m-hero__highlight rooms-reveal">
                <span className="camere-m-hero__highlight-icon" aria-hidden>
                  <Icon size={22} strokeWidth={1.65} />
                </span>
                <span className="camere-m-hero__highlight-label">{label}</span>
              </li>
            ))}
          </ul>
          <div className="camere-m-hero__actions rooms-reveal">
            <a className="camere-m-btn camere-m-btn--primary" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
              Prenota ora
            </a>
            <a className="camere-m-btn camere-m-btn--ghost" href="#lista-camere">
              Scopri le camere
            </a>
          </div>
        </div>
        <figure className="camere-m-hero__figure rooms-reveal">
          <img
            src={bijouImages.editorial.rooms}
            alt="Ambienti delle camere · Hotel Bijou Saint-Vincent"
            loading="eager"
            decoding="async"
          />
        </figure>
      </header>

      <div className="camere-m-features-bar" role="region" aria-label="Punti di forza">
        <div className="camere-m-features-bar__inner">
          {featuresBar.map(({ Icon, title, text }) => (
            <div key={title} className="camere-m-features-bar__item rooms-reveal">
              <span className="camere-m-features-bar__icon" aria-hidden>
                <Icon size={26} strokeWidth={1.5} />
              </span>
              <div className="camere-m-features-bar__copy">
                <p className="camere-m-features-bar__title">{title}</p>
                <p className="camere-m-features-bar__text">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section id="lista-camere" className="camere-m-rooms" aria-labelledby="camere-m-rooms-heading">
        <header className="camere-m-rooms__head">
          <span className="label rooms-reveal">Scegli la sistemazione giusta per te</span>
          <h2 id="camere-m-rooms-heading" className="serif camere-m-rooms__title rooms-reveal">
            Le nostre camere
          </h2>
          <p className="camere-m-rooms__intro rooms-reveal">
            Disponibilità in tempo reale sul portale di prenotazione; per richieste mirate scrivici dalla pagina{' '}
            <Link to="/contatti" className="camere-m-inline-link">
              Contatti
            </Link>
            .
          </p>
        </header>

        <div className="camere-m-rooms__grid">
          {roomTypes.map((room, i) => (
            <article key={room.id} id={room.id} className="camere-m-card rooms-reveal">
              <figure className="camere-m-card__figure">
                <img src={room.image} alt={room.alt} loading={i < 2 ? 'eager' : 'lazy'} decoding="async" />
              </figure>
              <div className="camere-m-card__body">
                <h3 className="camere-m-card__title serif">{room.title}</h3>
                <p className="camere-m-card__text">{room.text}</p>
                <div className="camere-m-card__meta">
                  <span className="camere-m-card__meta-item">
                    <User size={16} strokeWidth={1.75} aria-hidden />
                    {room.guests}
                  </span>
                  <span className="camere-m-card__meta-item">
                    <BedDouble size={16} strokeWidth={1.75} aria-hidden />
                    {room.bed}
                  </span>
                </div>
                <a className="camere-m-card__more" href={`#${room.id}`}>
                  Scopri di più
                  <ArrowRight size={16} strokeWidth={2} aria-hidden />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="camere-m-amenities-wrap" aria-labelledby="camere-m-amenities-label">
        <span id="camere-m-amenities-label" className="label camere-m-amenities-wrap__label rooms-reveal">
          Cosa trovi in ogni camera
        </span>
        <div className="camere-m-amenities-bar">
          {amenitiesBar.map(({ Icon, label }) => (
            <div key={label} className="camere-m-amenities-bar__item rooms-reveal">
              <span className="camere-m-amenities-bar__icon" aria-hidden>
                <Icon size={24} strokeWidth={1.55} />
              </span>
              <span className="camere-m-amenities-bar__label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="camere-m-duo" aria-labelledby="camere-m-duo-heading">
        <span id="camere-m-duo-heading" className="label rooms-reveal">
          Ancora qualche dettaglio
        </span>
        <div className="camere-m-duo__grid">
          {duoGallery.map((src, i) => (
            <img
              key={`${src}-${i}`}
              className="rooms-reveal"
              src={src}
              alt={`Dettaglio ambiente ${i + 1} · Hotel Bijou`}
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
      </section>

      <section className="room-cta-band camere-m-cta rooms-reveal" aria-label="Prenotazione">
        <p className="room-cta-band__lead serif">Pronto a scegliere la tua camera?</p>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-book-inline btn-book-cta-lg camere-m-cta__btn"
        >
          Verifica disponibilità
        </a>
      </section>
    </div>
  )
}

export default RoomsPage
