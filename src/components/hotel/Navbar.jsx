import { NavLink } from 'react-router-dom'
import { HotelStars } from '@/components/HotelStars'
import { BOOKING_URL } from '@/booking'
import { siteNavItems } from '@/siteNav'

export default function Navbar({ menuOpen, setMenuOpen, isNarrowViewport }) {
  return (
    <>
      <nav className="navbar" id="navbar" aria-label="Principale">
        <div className="navbar-bar">
          <NavLink
            end
            to="/"
            className="brand-lockup"
            aria-label="Hotel Bijou tre stelle — Home"
          >
            <span className="brand-lockup-mark">Bijou</span>
            <HotelStars className="hotel-stars--navbar" size={12} decorative />
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
              aria-label="Hotel Bijou tre stelle — Home"
              onClick={() => setMenuOpen(false)}
            >
              <span className="nav-sheet-brand__mark">Bijou</span>
              <span className="nav-sheet-brand__line" aria-hidden="true" />
              <span className="nav-sheet-brand__sub">Saint-Vincent, Valle d&apos;Aosta</span>
            </NavLink>

            <p className="nav-sheet-kicker label">Percorsi</p>

            <div className="nav-sheet-links-panel">
              <ul className="nav-sheet-links" aria-label="Sezioni">
                {siteNavItems.map((item) => (
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
    </>
  )
}
