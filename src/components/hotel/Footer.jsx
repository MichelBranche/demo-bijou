import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { BOOKING_URL } from '@/booking'
import { siteNavItems } from '@/siteNav'

export default function Footer() {
  const [footerEmail, setFooterEmail] = useState('')

  return (
    <footer className="footer footer--museum" id="prenota">
      <div className="footer__shell">
        <div className="footer__grid">
          <div className="footer__news">
            <h2 className="footer__lead serif">Restiamo in contatto.</h2>
            <p className="footer__lede">
              Novità sulla struttura, sugli eventi in valle e sulle offerte stagionali: lasciaci il tuo indirizzo email e
              sarai ricontattato dalla nostra reception.
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
              {siteNavItems.map((item) => (
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
          <div className="footer__wordmark-heavy">
            <span className="footer__wordmark-line footer__wordmark-line--heavy">Bijou</span>
          </div>
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
  )
}
