import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ExpandableGallery } from '@/components/ui/gallery-animation'
import HotelColazioneGallery from '../components/HotelColazioneGallery'
import { bijouImages } from '../assets/images'
import { BOOKING_URL } from '../booking'
import { prefersReducedMotion } from '../motionPrefs'

const hotelPhoto = bijouImages.hotelPage

const hotelSpazioAlts = [
  'Angolo lettura con libreria e poltrone · ambienti comuni Hotel Bijou',
  'Salotto con libreria bianca, zona relax e illuminazione morbida · Hotel Bijou',
]

const hotelColazioneAlts = [
  'Sala colazioni con passaggi dipinti nel blu e tavolate su tovaglie rosse · Hotel Bijou',
  'Tavola colazione dall’alto su tovaglia rossa · Hotel Bijou',
  'Servizio à la carte al tavolo: cappuccino, paste salate e selezione dolce · Hotel Bijou',
  'Buffet yogurt e formaggi locali Petit Brusson e Toma di Gressoney · Hotel Bijou',
]

function HotelPage() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const reduced = prefersReducedMotion()
    const lenis = reduced
      ? null
      : new Lenis({
          duration: 1.6,
          smoothWheel: true,
          smoothTouch: false,
        })

    let tickerCallback = () => {}
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update)
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

    const revealNodes = document.querySelectorAll('.hotel-reveal')
    if (reduced) {
      gsap.set(revealNodes, { opacity: 1, y: 0 })
    } else {
      gsap.set(revealNodes, { opacity: 0, y: 28 })
      gsap.to(revealNodes, {
        opacity: 1,
        y: 0,
        duration: 0.82,
        ease: 'power3.out',
        stagger: 0.06,
        delay: 0.06,
        scrollTrigger: {
          trigger: '.page-shell',
          start: 'top 92%',
        },
      })
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (lenis) {
        lenis.destroy()
        gsap.ticker.remove(tickerCallback)
      }
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <main className="page-shell">
      <header className="page-hero">
        <span className="label hotel-reveal">Hotel</span>
        <h1 className="serif hotel-reveal">Hotel Bijou</h1>
        <p className="page-intro hotel-reveal">
          Per noi l&apos;Hotel Bijou è la nostra casa e vogliamo condividerla con te. Il calore del caminetto, i
          pavimenti e i mobili in legno antico e i tessuti naturali, il tutto abbinato ad elementi di design moderno,
          creano un&apos;atmosfera magica dove ti aspettiamo per accoglierti con un sorriso.
        </p>
      </header>

      <section className="hotel-gallery-spazi-expand hotel-reveal" aria-label="Spazi comuni">
        <ExpandableGallery
          items={hotelPhoto.spaziComuni.map((src, i) => ({
            src,
            alt: hotelSpazioAlts[i] ?? `Spazi comuni Hotel Bijou ${i + 1}`,
          }))}
        />
      </section>

      <div className="prose-section">
        <h2 className="serif hotel-reveal">Arredi e ambienti</h2>
        <p className="hotel-reveal">
          Tutti gli arredi del nostro boutique hotel a Saint‑Vincent sono frutto di un&apos;accurata ricerca al fine di
          creare un&apos;atmosfera calda e raffinata sia nelle camere che negli ambienti comuni. Il soggiorno e la sala
          colazioni al piano terra, insieme al dehors situato sulla piazza, ti offrono un affaccio unico sulla vita del
          paese.
        </p>

        <h2 className="serif hotel-reveal">La colazione</h2>
        <p className="hotel-reveal">
          Ogni mattina a colazione ti aspetta il nostro ricco buffet composto da un&apos;attenta selezione dei migliori
          prodotti tipici valdostani: dai salumi e formaggi di macellerie e caseifici locali, il latte e lo yogurt da
          una piccola azienda agricola del Col de Joux, fino al caffè torrefatto a Morgex, il tutto accompagnato da
          un&apos;ampia scelta di torte e dolcetti fatti in casa e un servizio di caffetteria al tavolo. Su richiesta è
          possibile ordinare anche prodotti senza glutine, specifici per celiaci.
        </p>

        <section className="hotel-colazione-gallery-wrap hotel-reveal" aria-label="Immagini colazione">
          <HotelColazioneGallery
            photos={hotelPhoto.colazione.map((src, i) => ({
              src,
              alt: hotelColazioneAlts[i] ?? `Colazione Hotel Bijou ${i + 1}`,
            }))}
          />
        </section>

        <section className="hotel-wellness hotel-wellness--inline hotel-wellness--with-photo" aria-labelledby="hotel-wellness-heading">
          <span className="label hotel-reveal">Benessere</span>
          <h2 id="hotel-wellness-heading" className="serif hotel-reveal hotel-wellness__sector-title">
            Zona benessere
          </h2>
          <p className="hotel-reveal">
            Abbiamo inoltre predisposto una piccola zona benessere dove, tra sauna, bagno turco, docce a cascata e
            angolo tisane, potrai rilassarti dopo una giornata trascorsa alla scoperta delle nostre valli. Prenota
            presso la reception per accedervi in uso esclusivo in qualunque momento della giornata.
          </p>
          <figure className="hotel-wellness__figure hotel-reveal">
            <img
              src={hotelPhoto.benessereSauna}
              alt="Interno sauna in legno naturale · area benessere Hotel Bijou"
              decoding="async"
              loading="lazy"
              width={960}
              height={640}
            />
          </figure>
        </section>

        <h2 className="serif hotel-reveal">Struttura accessibile</h2>
        <p className="hotel-reveal">
          All&apos;Hotel Bijou non troverai nessuna barriera architettonica.
        </p>
        <p className="hotel-reveal prose-callout-book">
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
            Prenota direttamente online →
          </a>
        </p>
      </div>
    </main>
  )
}

export default HotelPage
