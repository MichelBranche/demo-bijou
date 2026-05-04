export const BOOKING_URL =
  'https://booking.bedzzle.com/desktop/?apikey=e9823d09b9c42a8c7f5b759a4cb29915&lang=it'

/**
 * Restituisce l’URL del motore con query aggiuntive (es. tipologia camera).
 * Se Bedzzle espone parametri dedicati, allinea i nomi qui e in `bookingParams` su ogni camera.
 */
export function bookingEngineUrl(extraParams = {}) {
  const url = new URL(BOOKING_URL)
  for (const [key, value] of Object.entries(extraParams)) {
    if (value != null && String(value).trim() !== '') {
      url.searchParams.set(key, String(value))
    }
  }
  return url.toString()
}
