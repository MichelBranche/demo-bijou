import { Leaf } from 'lucide-react'
import { BOOKING_URL } from '@/booking'

export default function AccessibilityCard() {
  return (
    <aside className="hotel-access-card" aria-label="Accessibilità">
      <div className="hotel-access-card__icon" aria-hidden="true">
        <Leaf strokeWidth={1.35} size={22} />
      </div>
      <h3 className="hotel-access-card__title">Struttura accessibile</h3>
      <p className="hotel-access-card__text">All&apos;Hotel Bijou non troverai nessuna barriera architettonica.</p>
      <a className="hotel-access-card__cta" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
        Prenota direttamente online →
      </a>
    </aside>
  )
}
