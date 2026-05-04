import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { bijouImages } from '../assets/images'
import { BOOKING_URL } from '../booking'
import { prefersReducedMotion } from '../motionPrefs'

function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    requestType: 'Informazioni',
    message: '',
  })
  const [formFeedback, setFormFeedback] = useState('')

  const onChangeField = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!formData.fullName || !formData.email || !formData.message) {
      setFormFeedback('Compila nome, email e messaggio.')
      return
    }

    const body = [
      'Buongiorno,',
      '',
      `Messaggio dal sito web Hotel Bijou:`,
      `- Nome e cognome: ${formData.fullName}`,
      `- Email: ${formData.email}`,
      `- Telefono: ${formData.phone || 'Non indicato'}`,
      `- Tipo richiesta: ${formData.requestType}`,
      '',
      'Messaggio:',
      formData.message,
    ].join('\n')

    window.location.href = `mailto:info@bijouhotel.it?subject=${encodeURIComponent(
      'Richiesta da sito Hotel Bijou',
    )}&body=${encodeURIComponent(body)}`

    setFormFeedback(
      'Messaggio preparato: si aprirà il client di posta con testo precompilato.',
    )
  }

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const reduced = prefersReducedMotion()
    const lenis = reduced
      ? null
      : new Lenis({
          duration: 1.4,
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

    const revealNodes = document.querySelectorAll('.contact-reveal')
    if (reduced) {
      gsap.set(revealNodes, { opacity: 1, y: 0 })
    } else {
      gsap.set(revealNodes, { opacity: 0, y: 24 })
      gsap.to(revealNodes, {
        opacity: 1,
        y: 0,
        duration: 0.82,
        ease: 'power3.out',
        stagger: 0.06,
        delay: 0.05,
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

  const mapSrc =
    'https://maps.google.com/maps?q=Hotel+Bijou+Piazza+Cavalieri+di+Vittorio+Veneto+3+Saint-Vincent+Italy&t=&z=16&ie=UTF8&iwloc=&output=embed'

  return (
    <main className="page-shell contact-page">
      <section className="contact-hero">
        <span className="label contact-reveal">Contatti</span>
        <h1 className="serif contact-reveal">
          Prenotazioni e informazioni dalla piazza di Saint‑Vincent
        </h1>
        <p className="contact-reveal">
          In piazza a Saint‑Vincent la reception verifica disponibilità reale, orienta sulla camera più adatta quando servono
          accessibilità, animali al seguito o un piano più silenzioso, e suggerisce itinerari nella valle. Per tariffe
          giornaliere aggiornate in automatico dall&apos;hotel usate anche il{' '}
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
            portale di prenotazione diretto
          </a>
          .
        </p>
      </section>

      <section className="contact-grid">
        <article className="contact-card contact-reveal">
          <h2 className="serif">Hotel Bijou</h2>
          <p>
            Tel.{' '}
            <a href="tel:+390166510067">+39 0166 510067</a>
          </p>
          <p>
            E-mail{' '}
            <a href="mailto:info@bijouhotel.it">info@bijouhotel.it</a>
          </p>
        </article>

        <article className="contact-card contact-reveal">
          <h2 className="serif">Indirizzo</h2>
          <p>Piazza Cavalieri di Vittorio Veneto, 3</p>
          <p>11027 Saint-Vincent (AO), Italia</p>
          <p>
            <a
              href="https://maps.google.com/?q=Hotel+Bijou+Piazza+Cavalieri+di+Vittorio+Veneto%2C+3+Saint-vincent"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apri in Google Maps
            </a>
          </p>
        </article>

        <article className="contact-card contact-reveal">
          <h2 className="serif">Numeri utili</h2>
          <p>
            Le camere sono confermate in base alle unità disponibili: quando chiamate, indicate preferenze su piano, bagno,
            rumorosità.
          </p>
          <p>Il pulsante «Prenota» in alto apre il modulo di booking ufficiale pubblicato dall&apos;hotel.</p>
        </article>
      </section>

      <section className="contact-map contact-reveal">
        <h2 className="serif">Dove siamo</h2>
        <div className="contact-map-frame">
          <iframe
            title="Mappa Hotel Bijou Saint-Vincent"
            src={mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <section className="contact-form-section contact-reveal">
        <h2 className="serif">Scrivici</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            Nome e cognome
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={onChangeField}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChangeField}
              required
            />
          </label>
          <label>
            Telefono
            <input type="tel" name="phone" value={formData.phone} onChange={onChangeField} />
          </label>
          <label>
            Tipo richiesta
            <select name="requestType" value={formData.requestType} onChange={onChangeField}>
              <option>Informazioni</option>
              <option>Prenotazione</option>
              <option>Camere famiglia / gruppi</option>
              <option>Accessibilità</option>
              <option>Animali</option>
              <option>Benessere interno hotel</option>
            </select>
          </label>
          <label className="contact-form-message">
            Messaggio
            <textarea
              name="message"
              value={formData.message}
              onChange={onChangeField}
              rows={5}
              required
            />
          </label>
          <button type="submit">Invia via e-mail</button>
          {formFeedback && <p className="contact-form-feedback">{formFeedback}</p>}
        </form>
      </section>

      <section className="contact-image-section contact-reveal">
        <img
          src={bijouImages.hero}
          alt="Ambiente camera Hotel Bijou"
          loading="lazy"
          decoding="async"
        />
      </section>
    </main>
  )
}

export default ContactPage
