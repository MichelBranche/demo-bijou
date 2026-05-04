import { Star } from 'lucide-react'

const COUNT = 3

/**
 * Riferimento visivo alla categoria a tre stelle (classificazione ricettiva).
 * @param {{ className?: string, size?: number, decorative?: boolean }} props
 */
export function HotelStars({ className = '', size = 14, decorative = false }) {
  const stars = Array.from({ length: COUNT }, (_, i) => (
    <Star
      key={i}
      size={size}
      className="hotel-stars__icon"
      strokeWidth={1.65}
      fill="currentColor"
      stroke="currentColor"
      aria-hidden
    />
  ))

  const cn = ['hotel-stars', className].filter(Boolean).join(' ')

  if (decorative) {
    return (
      <span className={cn} aria-hidden="true">
        {stars}
      </span>
    )
  }

  return (
    <span className={cn} role="img" aria-label="Tre stelle">
      {stars}
    </span>
  )
}
