/**
 * Punteggi da aggiornare quando le schede pubbliche cambiano.
 * Booking / HotelsCombined: scala /10. TripAdvisor: scala /5.
 */

/** @typedef {{ id: string, name: string, rating: number, maxRating: 10 | 5, profileUrl: string }} ReviewPlatform */

/** @type {ReviewPlatform[]} */
export const bijouReviewPlatforms = [
  {
    id: 'booking',
    name: 'Booking.com',
    rating: 9.2,
    maxRating: 10,
    profileUrl: 'https://www.booking.com/hotel/it/bijou.html',
  },
  {
    id: 'hotelscombined',
    name: 'HotelsCombined',
    rating: 9.2,
    maxRating: 10,
    profileUrl: 'https://www.hotelscombined.com/Hotel/Bijou_Saint_Vincent.htm',
  },
  {
    id: 'tripadvisor',
    name: 'TripAdvisor',
    /* Aggiorna leggendo il voto /5 sulla scheda ufficiale */
    rating: 4.8,
    maxRating: 5,
    profileUrl:
      'https://www.tripadvisor.it/Hotel_Review-g194926-d623065-Reviews-Bijou_Hotel-Saint_Vincent_Valle_d_Aosta.html',
  },
]
