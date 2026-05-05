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

export const defaultSeoImage = absoluteUrl('/images/bijou/hero-piazza-saint-vincent.png')

