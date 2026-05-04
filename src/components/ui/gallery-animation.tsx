import { motion, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { createPortal } from 'react-dom'

export type ExpandableGalleryItem = {
  src: string
  alt: string
}

export interface ExpandableGalleryProps {
  items?: ExpandableGalleryItem[]
  images?: string[]
  className?: string
}

export type MorphRect = { left: number; top: number; width: number; height: number }

function buildEntries(props: ExpandableGalleryProps): ExpandableGalleryItem[] {
  if (props.items?.length) return props.items
  if (props.images?.length) {
    return props.images.map((src, index) => ({
      src,
      alt: `Immagine gallery ${index + 1}`,
    }))
  }
  return []
}

function getLightboxTargetBox(imgEl: HTMLImageElement) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const nw = imgEl.naturalWidth || vw
  const nh = imgEl.naturalHeight || vh
  const maxW = Math.min(1200, vw * 0.94)
  const maxH = Math.min(900, vh * 0.82)
  const scale = Math.min(maxW / nw, maxH / nh, 1)
  const fw = Math.round(nw * scale)
  const fh = Math.round(nh * scale)
  const cx = Math.max(10, Math.round((vw - fw) / 2))
  const cy = Math.max(52, Math.round((vh - fh) / 2))
  return { cx, cy, fw, fh }
}

function readExpandThumbRect(galleryRoot: HTMLElement | null, idx: number): MorphRect | null {
  if (!galleryRoot) return null
  const cell = galleryRoot.querySelector(`[data-expand-gallery-thumb="${idx}"]`)
  const thumbImg = cell?.querySelector('img')
  if (!thumbImg || typeof thumbImg.getBoundingClientRect !== 'function') return null
  const br = thumbImg.getBoundingClientRect()
  return { left: br.left, top: br.top, width: br.width, height: br.height }
}

const BACKDROP_DISMISS_GUARD_MS = 480

export function ExpandableGallery({ items: itemsProp, images, className = '' }: ExpandableGalleryProps) {
  const items = buildEntries({ items: itemsProp, images })
  const reduced = useReducedMotion()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  /** Rettangolo miniatura solo all’apertura da strip; `null` se cambio immagine da frecce. */
  const [morphFrom, setMorphFrom] = useState<MorphRect | null>(null)

  const openedAtRef = useRef(0)
  const preFocusRef = useRef<HTMLElement | null>(null)
  const selectedIndexRef = useRef<number | null>(null)
  const lightboxCloseBtnRef = useRef<HTMLButtonElement | null>(null)
  const closingGuardRef = useRef(false)
  const lightboxCtxRef = useRef<(() => void) | null>(null)

  const overlayRef = useRef<HTMLDivElement | null>(null)
  const scrimRef = useRef<HTMLDivElement | null>(null)
  const lightboxImgRef = useRef<HTMLImageElement | null>(null)
  const galleryFanRootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    selectedIndexRef.current = selectedIndex
  }, [selectedIndex])

  const selectedPhotoSrc =
    selectedIndex !== null && items[selectedIndex] ? items[selectedIndex].src : ''

  /** Chiusura “logica”: stato + focus (dopo GSAP il portale viene smontato). */
  const finalizeClose = useCallback(() => {
    closingGuardRef.current = false
    setSelectedIndex(null)
    setHoveredIndex(null)
    setMorphFrom(null)
    queueMicrotask(() => preFocusRef.current?.focus({ preventScroll: true }))
    preFocusRef.current = null
    lightboxCtxRef.current?.()
    lightboxCtxRef.current = null
  }, [])

  /** GSAP morph verso thumb + fade; poi finalize. */
  const requestCloseAnimated = useCallback(() => {
    if (selectedIndexRef.current === null) return

    if (reduced || !overlayRef.current) {
      gsap.killTweensOf(
        [
          lightboxImgRef.current,
          scrimRef.current,
          lightboxCloseBtnRef.current,
          ...(overlayRef.current?.querySelectorAll('.expand-gallery-nav') ?? []),
        ].filter(Boolean),
      )
      finalizeClose()
      return
    }

    if (closingGuardRef.current) return
    closingGuardRef.current = true

    const dlg = overlayRef.current
    const imgEl = lightboxImgRef.current
    const scrim = scrimRef.current
    const closeBtn = lightboxCloseBtnRef.current
    const navNodes = dlg.querySelectorAll('.expand-gallery-nav')

    gsap.killTweensOf(
      [imgEl, scrim, closeBtn, ...(navNodes.length ? [...navNodes] : [])].filter(Boolean),
    )
    lightboxCtxRef.current?.()
    lightboxCtxRef.current = null

    if (!imgEl || !scrim) {
      finalizeClose()
      return
    }

    const idx = selectedIndexRef.current
    imgEl.style.objectFit = 'cover'
    const vr = imgEl.getBoundingClientRect()
    const thumbRect = typeof idx === 'number' ? readExpandThumbRect(galleryFanRootRef.current, idx) : null
    const dest = thumbRect ?? {
      left: Math.round(window.innerWidth / 2 - 100),
      top: Math.round(window.innerHeight / 2 - 75),
      width: 200,
      height: 150,
    }

    const controls = [closeBtn, ...navNodes].filter(Boolean) as HTMLElement[]

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        gsap.set(imgEl, {
          clearProps:
            'position,left,top,width,height,maxWidth,maxHeight,minWidth,minHeight,zIndex,x,y,rotate,scale,skew,borderRadius,opacity',
        })
        imgEl.style.removeProperty('object-fit')
        finalizeClose()
      },
    })

    tl.to(controls, { opacity: 0, duration: 0.22 }, 0)
    tl.to(scrim, { opacity: 0, duration: 0.52, ease: 'power2.out' }, 0.1)
    tl.fromTo(
      imgEl,
      {
        opacity: 1,
        position: 'fixed',
        left: vr.left,
        top: vr.top,
        width: vr.width,
        height: vr.height,
        borderRadius: 12,
        zIndex: 520,
      },
      {
        left: dest.left,
        top: dest.top,
        width: dest.width,
        height: dest.height,
        borderRadius: 18,
        duration: 0.95,
        ease: 'power3.inOut',
      },
      0.08,
    )
  }, [reduced, finalizeClose])

  const backdropDismissAllowed = () => {
    const now = typeof performance !== 'undefined' ? performance.now() : openedAtRef.current + BACKDROP_DISMISS_GUARD_MS + 1
    return now - openedAtRef.current >= BACKDROP_DISMISS_GUARD_MS
  }

  const tryDismissBackdrop = () => {
    if (!backdropDismissAllowed()) return
    requestCloseAnimated()
  }

  const openStrip = useCallback(
    (index: number, event?: ReactMouseEvent<HTMLElement> | ReactKeyboardEvent<HTMLElement>) => {
      if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
        preFocusRef.current = document.activeElement
      }
      openedAtRef.current = typeof performance !== 'undefined' ? performance.now() : 0
      setHoveredIndex(null)

      if (event && 'currentTarget' in event) {
        const imgEl = (event.currentTarget as HTMLElement).querySelector('img')
        if (imgEl && typeof imgEl.getBoundingClientRect === 'function') {
          const r = imgEl.getBoundingClientRect()
          setMorphFrom({ left: r.left, top: r.top, width: r.width, height: r.height })
        } else {
          setMorphFrom(readExpandThumbRect(galleryFanRootRef.current, index))
        }
      } else {
        setMorphFrom(readExpandThumbRect(galleryFanRootRef.current, index))
      }
      setSelectedIndex(index)
    },
    [],
  )

  const goToNext = (e?: MouseEvent) => {
    e?.stopPropagation()
    setMorphFrom(null)
    setSelectedIndex((v) => (typeof v === 'number' && items.length > 1 ? (v + 1) % items.length : v))
  }

  const goToPrev = (e?: MouseEvent) => {
    e?.stopPropagation()
    setMorphFrom(null)
    setSelectedIndex((v) => (typeof v === 'number' && items.length > 1 ? (v - 1 + items.length) % items.length : v))
  }

  useEffect(() => {
    if (selectedIndex === null) return undefined
    const n = items.length
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        if (closingGuardRef.current) return
        requestCloseAnimated()
        return
      }
      if (n < 2) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setMorphFrom(null)
        setSelectedIndex((v) => (typeof v === 'number' ? (v - 1 + n) % n : v))
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        setMorphFrom(null)
        setSelectedIndex((v) => (typeof v === 'number' ? (v + 1) % n : v))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedIndex, items.length, requestCloseAnimated])

  useEffect(() => {
    if (selectedIndex === null) return
    const t = window.setTimeout(() => lightboxCloseBtnRef.current?.focus({ preventScroll: true }), reduced ? 0 : 120)
    return () => window.clearTimeout(t)
  }, [selectedIndex, reduced, selectedPhotoSrc])

  useEffect(() => {
    if (selectedIndex === null) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [selectedIndex])

  useLayoutEffect(() => {
    if (selectedIndex === null || reduced) return undefined

    const imgEl = lightboxImgRef.current
    const scrim = scrimRef.current
    const root = overlayRef.current
    if (!imgEl || !scrim || !root || !items[selectedIndex] || !selectedPhotoSrc) return undefined

    const thumbRect = morphFrom

    gsap.killTweensOf(
      [
        imgEl,
        scrim,
        lightboxCloseBtnRef.current,
        ...(root.querySelectorAll('.expand-gallery-nav') ?? []),
      ].filter(Boolean),
    )
    lightboxCtxRef.current?.()
    lightboxCtxRef.current = null

    const run = () => {
      const { cx, cy, fw, fh } = getLightboxTargetBox(imgEl)
      imgEl.style.objectFit = 'cover'
      const navEls = root.querySelectorAll('.expand-gallery-nav')
      const closeEl = lightboxCloseBtnRef.current

      const ctx = gsap.context(() => {
        gsap.set(scrim, { opacity: 0 })

        gsap.set([...(navEls.length ? [...navEls] : []), closeEl].filter(Boolean), {
          opacity: thumbRect ? 0 : 1,
        })

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        if (thumbRect) {
          tl.fromTo(scrim, { opacity: 0 }, { opacity: 1, duration: 0.65, ease: 'power2.out' }, 0)
          tl.fromTo(
            imgEl,
            {
              opacity: 1,
              position: 'fixed',
              left: thumbRect.left,
              top: thumbRect.top,
              width: thumbRect.width,
              height: thumbRect.height,
              borderRadius: 18,
              zIndex: 520,
              x: 0,
              y: 0,
            },
            {
              left: cx,
              top: cy,
              width: fw,
              height: fh,
              borderRadius: 12,
              duration: 1.05,
              ease: 'power3.inOut',
            },
            0,
          ).add(() => {
            gsap.set(imgEl, {
              clearProps:
                'position,left,top,width,height,maxWidth,maxHeight,minWidth,minHeight,zIndex,x,y,rotate,scale,skew',
            })
            imgEl.style.objectFit = 'contain'
          })
        } else {
          tl.to(scrim, { opacity: 1, duration: 0.45, ease: 'power2.out' }, 0)
          gsap.set(imgEl, { opacity: 0, y: 20, scale: 0.985 })
          tl.to(
            imgEl,
            { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out' },
            0.08,
          ).add(() => {
            gsap.set(imgEl, { clearProps: 'opacity,scale,transform,x,y' })
          })
        }

        tl.to(
          [...(navEls.length ? [...navEls] : []), closeEl].filter(Boolean),
          { opacity: 1, duration: 0.38, stagger: 0.05 },
          thumbRect ? 0.78 : 0.1,
        )
      }, root)

      lightboxCtxRef.current = () => ctx.revert()
    }

    if (imgEl.complete && imgEl.naturalWidth) {
      queueMicrotask(run)
      return () => {
        gsap.killTweensOf([imgEl, scrim].filter(Boolean))
        lightboxCtxRef.current?.()
        lightboxCtxRef.current = null
      }
    }

    const onDecode = () => queueMicrotask(run)
    imgEl.addEventListener('load', onDecode)
    imgEl.decode?.().catch(() => {})
    return () => {
      imgEl.removeEventListener('load', onDecode)
      gsap.killTweensOf([imgEl, scrim].filter(Boolean))
      lightboxCtxRef.current?.()
      lightboxCtxRef.current = null
    }
    // selectedPhotoSrc identifica l'item; items.length evita indice fuori range se la lista cambia
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `items` viene ricreato ogni render da buildEntries
  }, [selectedIndex, reduced, selectedPhotoSrc, morphFrom, items.length])

  const galleryLocked = selectedIndex !== null

  const flexGrowFor = (index: number) => {
    if (reduced || galleryLocked || hoveredIndex === null) return 1
    return hoveredIndex === index ? 2.25 : 0.625
  }

  if (!items.length) return null

  const lightboxPortal =
    typeof document !== 'undefined' && selectedIndex !== null && items[selectedIndex] ? (
      <div
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Galleria immagine ingrandita"
        className="fixed inset-0 isolate z-[500]"
        onClick={(e) => {
          if (e.target !== e.currentTarget) return
          tryDismissBackdrop()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') e.stopPropagation()
        }}
      >
        <div
          ref={scrimRef}
          role="presentation"
          aria-hidden
          className={`pointer-events-none fixed inset-0 z-0 bg-black/92 backdrop-blur-sm ${reduced ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="pointer-events-none fixed inset-0 z-[1] flex items-center justify-center px-4 pb-8 pt-[max(3.75rem,calc(env(safe-area-inset-top)+3rem))] min-[768px]:p-12 min-[768px]:pt-12">
          <button
            ref={lightboxCloseBtnRef}
            type="button"
            aria-label="Chiudi"
            className="expand-gallery-nav pointer-events-auto fixed right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-[530] rounded-full p-2.5 text-[#fdfaf5] opacity-100 transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            onClick={(e) => {
              e.stopPropagation()
              requestCloseAnimated()
            }}
          >
            <X className="h-7 w-7 min-[768px]:h-8 min-[768px]:w-8" strokeWidth={2} aria-hidden />
          </button>

          {items.length > 1 ? (
            <button
              type="button"
              className="expand-gallery-nav pointer-events-auto fixed left-[max(0.75rem,env(safe-area-inset-left))] top-1/2 z-[530] -translate-y-1/2 rounded-full p-2 text-[#fdfaf5] opacity-100 transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label="Immagine precedente"
              onClick={goToPrev}
            >
              <ChevronLeft className="h-9 w-9 min-[768px]:h-10 min-[768px]:w-10" strokeWidth={2} aria-hidden />
            </button>
          ) : null}

          <div
            className="pointer-events-auto relative w-full max-w-[min(96vw,1120px)] shrink-0"
            role="presentation"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative inline-flex w-full justify-center">
              <img
                key={selectedPhotoSrc}
                ref={lightboxImgRef}
                src={items[selectedIndex].src}
                alt={items[selectedIndex].alt}
                className="max-h-[min(82vh,900px)] max-w-full rounded-[var(--radius-md)] object-contain shadow-2xl"
                draggable={false}
                decoding="async"
              />
            </div>
          </div>

          {items.length > 1 ? (
            <button
              type="button"
              className="expand-gallery-nav pointer-events-auto fixed right-[max(0.75rem,env(safe-area-inset-right))] top-1/2 z-[530] -translate-y-1/2 rounded-full p-2 text-[#fdfaf5] opacity-100 transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label="Immagine successiva"
              onClick={goToNext}
            >
              <ChevronRight className="h-9 w-9 min-[768px]:h-10 min-[768px]:w-10" strokeWidth={2} aria-hidden />
            </button>
          ) : null}

          <div className="pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-[530] -translate-x-1/2 rounded-full bg-black/45 px-4 py-2 text-xs text-[#fdfaf5] backdrop-blur-sm">
            {selectedIndex + 1} / {items.length}
          </div>
        </div>
      </div>
    ) : null

  return (
    <div ref={galleryFanRootRef} className={className}>
      <div
        className={galleryLocked ? 'pointer-events-none select-none opacity-90' : undefined}
        aria-hidden={galleryLocked}
      >
        <div className="flex h-auto min-h-52 w-full flex-col gap-2 min-[720px]:h-[22rem] min-[720px]:min-h-[16rem] min-[720px]:flex-row">
          {items.map((entry, index) => (
            <motion.div
              key={entry.src}
              data-expand-gallery-thumb={index}
              className={`relative flex min-h-36 min-[720px]:min-h-0 min-[720px]:min-w-0 ${galleryLocked ? 'cursor-default' : 'cursor-pointer'} overflow-hidden rounded-[var(--radius-md)] outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[var(--accent)]`}
              layout={false}
              style={{ flexBasis: 0, flexShrink: 1, minHeight: 'clamp(8.5rem, 28vw, 11rem)', minWidth: 0 }}
              animate={{ flexGrow: flexGrowFor(index) }}
              transition={{ duration: reduced ? 0.01 : 0.52, ease: [0.4, 0, 0.2, 1] }}
              onHoverStart={() => {
                if (!galleryLocked && !reduced) setHoveredIndex(index)
              }}
              onHoverEnd={() => {
                setHoveredIndex((h) => (h === index ? null : h))
              }}
              role="button"
              tabIndex={galleryLocked ? -1 : 0}
              onClick={(e) => {
                if (!galleryLocked) openStrip(index, e)
              }}
              onKeyDown={(e) => {
                if (galleryLocked) return
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  openStrip(index, e)
                }
              }}
              aria-expanded={selectedIndex === index}
              aria-label={`Apri a schermo intero: ${entry.alt}`}
            >
              <img
                src={entry.src}
                alt=""
                className="pointer-events-none h-full min-h-[10rem] w-full object-cover min-[720px]:min-h-0"
                draggable={false}
                loading="lazy"
                decoding="async"
              />
              <motion.div
                className="pointer-events-none absolute inset-0 bg-black"
                initial={false}
                animate={{ opacity: reduced || hoveredIndex === index ? 0 : 0.32 }}
                transition={{ duration: reduced ? 0 : 0.28 }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {lightboxPortal ? createPortal(lightboxPortal, document.body) : null}
    </div>
  )
}
