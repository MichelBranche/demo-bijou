import { useEffect } from 'react'
import { absoluteUrl, defaultSeoImage } from '@/seo/siteSeo'

function ensureMeta(attr, key) {
  const selector = `meta[${attr}="${key}"]`
  let node = document.head.querySelector(selector)
  if (!node) {
    node = document.createElement('meta')
    node.setAttribute(attr, key)
    document.head.appendChild(node)
  }
  return node
}

function ensureLink(rel) {
  let node = document.head.querySelector(`link[rel="${rel}"]`)
  if (!node) {
    node = document.createElement('link')
    node.setAttribute('rel', rel)
    document.head.appendChild(node)
  }
  return node
}

/**
 * @param {{
 * title: string
 * description: string
 * pathname: string
 * image?: string
 * type?: 'website' | 'article'
 * jsonLd?: Record<string, unknown> | Record<string, unknown>[]
 * noindex?: boolean
 * }} input
 */
export function usePageSeo(input) {
  useEffect(() => {
    const {
      title,
      description,
      pathname,
      image = defaultSeoImage,
      type = 'website',
      jsonLd,
      noindex = false,
    } = input

    const canonical = absoluteUrl(pathname)
    const robots = noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'

    document.title = title
    ensureMeta('name', 'description').setAttribute('content', description)
    ensureMeta('name', 'robots').setAttribute('content', robots)

    ensureMeta('property', 'og:locale').setAttribute('content', 'it_IT')
    ensureMeta('property', 'og:site_name').setAttribute('content', 'Hotel Bijou')
    ensureMeta('property', 'og:type').setAttribute('content', type)
    ensureMeta('property', 'og:title').setAttribute('content', title)
    ensureMeta('property', 'og:description').setAttribute('content', description)
    ensureMeta('property', 'og:url').setAttribute('content', canonical)
    ensureMeta('property', 'og:image').setAttribute('content', image)

    ensureMeta('name', 'twitter:card').setAttribute('content', 'summary_large_image')
    ensureMeta('name', 'twitter:title').setAttribute('content', title)
    ensureMeta('name', 'twitter:description').setAttribute('content', description)
    ensureMeta('name', 'twitter:image').setAttribute('content', image)

    ensureLink('canonical').setAttribute('href', canonical)

    const ldId = 'page-jsonld'
    const prevLd = document.getElementById(ldId)
    if (prevLd) prevLd.remove()
    if (jsonLd) {
      const script = document.createElement('script')
      script.id = ldId
      script.type = 'application/ld+json'
      script.text = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }
  }, [input])
}

