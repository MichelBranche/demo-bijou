const b = `${import.meta.env.BASE_URL}brands/`

/**
 * Marchi da asset statici in `public/brands/` (SVG / PNG dai materiali pubblici Wikimedia Commons
 * dove indicato PD-textlogo — marchi registrati delle rispettive società).
 */
const BRAND_SRC = /** @type {const} */ ({
  booking: `${b}booking-wordmark.svg`,
  hotelscombined: `${b}hotelscombined.png`,
  tripadvisor: `${b}tripadvisor-logo.svg`,
})

export function OfficialReviewLogo({ id }) {
  const src = BRAND_SRC[id]
  if (!src) return null
  return (
    <span className="reputation-strip__brand">
      <img
        src={src}
        alt=""
        className="reputation-strip__logo-img"
        loading="lazy"
        decoding="async"
      />
    </span>
  )
}
