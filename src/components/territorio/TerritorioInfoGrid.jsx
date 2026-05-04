import { CalendarDays, Castle, Mountain, Trees } from 'lucide-react'
import { Link } from 'react-router-dom'

const iconMap = {
  mountain: Mountain,
  trees: Trees,
  castle: Castle,
  events: CalendarDays,
}

/** @typedef {{ id: string, icon: keyof typeof iconMap, title: string, sub: string, lede: string, bullets: string[], ctaTo?: string, ctaLabel?: string }} TerritorioInfoCardData */

/** @param {{ cards: TerritorioInfoCardData[] }} props */
export default function TerritorioInfoGrid({ cards }) {
  return (
    <section
      className="territorio-info-grid territorio-block"
      aria-label="Sport, natura, cultura ed eventi in Valle d'Aosta"
    >
      <div className="territorio-landing__container">
        <div className="territorio-info-grid__cards">
          {cards.map((card) => {
            const Icon = iconMap[card.icon] ?? Mountain
            return (
              <article key={card.id} className="territorio-info-card" data-reveal>
                <div className="territorio-info-card__icon" aria-hidden="true">
                  <Icon size={22} strokeWidth={1.35} />
                </div>
                <h3 className="territorio-info-card__title">{card.title}</h3>
                <p className="territorio-info-card__sub">{card.sub}</p>
                <p className="territorio-info-card__lede">{card.lede}</p>
                <ul className="territorio-info-card__list">
                  {card.bullets.map((b, j) => (
                    <li key={`${card.id}-b${j}`}>
                      <CheckMini />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                {card.ctaTo && card.ctaLabel ? (
                  <Link className="territorio-info-card__link" to={card.ctaTo}>
                    {card.ctaLabel}
                  </Link>
                ) : null}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CheckMini() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 6 9 17l-5-5"
      />
    </svg>
  )
}
