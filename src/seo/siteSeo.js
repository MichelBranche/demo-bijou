const RAW_SITE_URL = import.meta.env.VITE_SITE_URL || 'https://www.bijouhotel.it'

export const SITE_URL = RAW_SITE_URL.replace(/\/+$/, '')

/**
 * @param {string} path
 * @returns {string}
 */
export function absoluteUrl(path = '/') {
  const safePath = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${safePath}`
}

export const defaultSeoImage = absoluteUrl('/images/bijou/og-share.jpg')

/** Dimensioni immagine social (Open Graph / Twitter). */
export const defaultSeoImageMeta = {
  width: 1200,
  height: 630,
  alt: 'Hotel Bijou — boutique hotel in piazza a Saint-Vincent, Valle d\'Aosta',
}

