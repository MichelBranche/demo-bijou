import { motion } from 'framer-motion'
import gsap from 'gsap'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../motionPrefs'

/** Centro → spread tipo “deck” fotografiche (4 foto). */
const FAN_SPECS = [
  { order: 0, x: '-238px', y: '12px', zIndex: 50, tiltSign: -1 },
  { order: 1, x: '-79px', y: '30px', zIndex: 40, tiltSign: -1 },
  { order: 2, x: '79px', y: '10px', zIndex: 30, tiltSign: 1 },
  { order: 3, x: '238px', y: '26px', zIndex: 20, tiltSign: 1 },
]

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
}

const photoVariants = {
  hidden: { x: 0, y: 0, rotate: 0, scale: 1 },
  visible: (custom) => ({
    x: custom.x,
    y: custom.y,
    rotate: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 70,
      damping: 12,
      mass: 1,
      delay: custom.order * 0.14,
    },
  }),
}

/** Box finale centrato nella viewport • max come in CSS `.hotel-photo-lightbox__img`. */
function getLightboxTargetBox(imgEl) {
  const vv = window.visualViewport
  const vw = Math.round(Math.min(vv?.width ?? window.innerWidth, window.innerWidth))
  const vh = Math.round(Math.min(vv?.height ?? window.innerHeight, window.innerHeight))
  const nw = imgEl.naturalWidth || vw
  const nh = imgEl.naturalHeight || vh
  const inset = vw < 480 ? 10 : 14
  const padReserve = vw < 540 ? 88 : 64
  const maxW = Math.min(1200, vw - inset * 2)
  const maxH = Math.min(900, Math.max(120, Math.floor(vh * (vw < 540 ? 0.62 : 0.76) - padReserve)))
  const scale = Math.min(maxW / nw, maxH / nh, 1)
  const fw = Math.round(nw * scale)
  const fh = Math.round(nh * scale)
  const cx = Math.max(inset, Math.round((vw - fw) / 2))
  const cy = Math.max(
    Math.round(inset + (typeof vv?.offsetTop === 'number' ? vv.offsetTop : 0)),
    Math.round((vh - fh) / 2),
  )
  return { cx, cy, fw, fh }
}

/** Rect miniatura corrente per morph in chiusura (legge `data-hotel-gallery-thumb`). */
function readThumbRect(galleryRoot, /** @type {number} */ idx) {
  if (!galleryRoot) return null
  const trigger = galleryRoot.querySelector(`button[data-hotel-gallery-thumb="${idx}"]`)
  const thumbImg = trigger?.querySelector?.('img')
  if (!thumbImg || typeof thumbImg.getBoundingClientRect !== 'function') return null
  const br = thumbImg.getBoundingClientRect()
  return { left: br.left, top: br.top, width: br.width, height: br.height }
}

/**
 * Colazione — fan animato / griglia + lightbox fullscreen con ingresso GSAP dalla miniatura.
 */
export default function HotelColazioneGallery({ photos, animationDelay = 0.35 }) {
  const dialogRef = useRef(/** @type {HTMLDialogElement | null} */ (null))
  const closeBtnRef = useRef(/** @type {HTMLButtonElement | null} */ (null))
  const lightboxImgRef = useRef(/** @type {HTMLImageElement | null} */ (null))
  const scrimRef = useRef(/** @type {HTMLDivElement | null} */ (null))
  const captionRef = useRef(/** @type {HTMLElement | null} */ (null))
  const galleryFanRootRef = useRef(/** @type {HTMLDivElement | null} */ (null))
  const viewerIndexRef = useRef(/** @type {number | null} */ (null))
  const closingGuardRef = useRef(false)

  /**
   * Rettangolo miniatura per morph GSAP (solo apertura da card). In stato React così
   * React Strict Mode / doppio useLayout non perdono il rect come con un ref consumato.
   */
  const [morphFrom, setMorphFrom] = useState(/** @type {null | { left: number; top: number; width: number; height: number }} */ (null))
  const lightboxCtxRef = useRef(/** @type {(() => void) | null} */ (null))

  const reducedOnMount = typeof window !== 'undefined' ? prefersReducedMotion() : false
  const [reduced, setReduced] = useState(reducedOnMount)
  const [narrowViewport, setNarrowViewport] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 719px)').matches,
  )
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [viewerIndex, setViewerIndex] = useState(/** @type {number | null} */ (null))

  const showVisible = reduced || isVisible
  const showLoaded = reduced || isLoaded

  const items = FAN_SPECS.slice(0, photos.length)
    .map((spec, i) => (photos[i] ? { photo: photos[i], spec } : null))
    .filter(Boolean)
  const galleryPhotos = items.map((e) => e.photo)
  const n = galleryPhotos.length

  useEffect(() => {
    viewerIndexRef.current = viewerIndex
  }, [viewerIndex])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const mq = window.matchMedia('(max-width: 719px)')
    const sync = () => setNarrowViewport(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (reduced) return undefined
    const visibilityTimer = window.setTimeout(() => setIsVisible(true), animationDelay * 1000)
    const animationTimer = window.setTimeout(() => setIsLoaded(true), (animationDelay + 0.4) * 1000)
    return () => {
      window.clearTimeout(visibilityTimer)
      window.clearTimeout(animationTimer)
    }
  }, [animationDelay, reduced])

  useLayoutEffect(() => {
    const d = dialogRef.current
    if (!d) return
    if (viewerIndex !== null) {
      d.showModal()
      window.requestAnimationFrame(() => closeBtnRef.current?.focus({ preventScroll: true }))
    } else if (d.open) {
      d.close()
    }
  }, [viewerIndex])

  useEffect(() => {
    if (viewerIndex === null || n < 2) return undefined
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setMorphFrom(null)
        setViewerIndex((v) => (typeof v !== 'number' ? v : (v - 1 + n) % n))
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        setMorphFrom(null)
        setViewerIndex((v) => (typeof v !== 'number' ? v : (v + 1) % n))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [viewerIndex, n])

  const viewerPhotoSrc = viewerIndex !== null ? (galleryPhotos[viewerIndex]?.src ?? '') : ''

  useLayoutEffect(() => {
    if (viewerIndex === null || reduced) return undefined

    const imgEl = lightboxImgRef.current
    const dlg = dialogRef.current
    const scrim = scrimRef.current
    const cap = captionRef.current
    if (!imgEl || !dlg?.open || !scrim || !viewerPhotoSrc) return undefined

    const thumbRect = morphFrom

    lightboxCtxRef.current?.()
    lightboxCtxRef.current = null

    gsap.killTweensOf([imgEl, scrim, cap].filter(Boolean))

    const run = () => {
      const { cx, cy, fw, fh } = getLightboxTargetBox(imgEl)
      const narrow = typeof window !== 'undefined' && window.innerWidth < 540
      imgEl.style.objectFit = narrow ? 'contain' : 'cover'

      const navEls = dlg?.querySelectorAll('.hotel-photo-lightbox__nav, .hotel-photo-lightbox__close') ?? []

      const ctx = gsap.context(() => {
        gsap.set(scrim, { opacity: 0 })
        if (cap) gsap.set(cap, { opacity: 0, y: thumbRect ? 14 : 0 })
        gsap.set(navEls.length ? [...navEls] : [], { opacity: thumbRect ? 0 : 1 })

        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
        })

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
              zIndex: 100,
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

        if (cap) {
          tl.fromTo(
            cap,
            { opacity: 0, y: thumbRect ? 16 : 6 },
            { opacity: 1, y: 0, duration: thumbRect ? 0.5 : 0.38 },
            thumbRect ? 0.82 : 0.14,
          )
        }

        tl.to(navEls.length ? [...navEls] : [], { opacity: 1, duration: 0.38, stagger: 0.05 }, thumbRect ? 0.78 : 0.1)
      }, dlg)

      lightboxCtxRef.current = () => ctx.revert()
    }

    if (imgEl.complete && imgEl.naturalWidth) {
      queueMicrotask(run)
      return () => {
        gsap.killTweensOf([imgEl, scrim, cap].filter(Boolean))
        lightboxCtxRef.current?.()
        lightboxCtxRef.current = null
      }
    }

    /** @returns {undefined} */
    const onDecode = () => queueMicrotask(run)
    imgEl.addEventListener('load', onDecode)
    imgEl.decode?.().catch(() => {})
    return () => {
      imgEl.removeEventListener('load', onDecode)
      gsap.killTweensOf([imgEl, scrim, cap].filter(Boolean))
      lightboxCtxRef.current?.()
      lightboxCtxRef.current = null
    }
  }, [viewerIndex, reduced, viewerPhotoSrc, morphFrom])

  const requestClose = useCallback(() => {
    const dlg = dialogRef.current
    if (!dlg?.open) return
    const idx = viewerIndexRef.current
    if (idx === null) return

    if (reduced) {
      dlg.close()
      return
    }

    if (closingGuardRef.current) return
    closingGuardRef.current = true

    const imgEl = lightboxImgRef.current
    const scrim = scrimRef.current
    const cap = captionRef.current
    const closeBtn = closeBtnRef.current
    const navNodes = dlg.querySelectorAll('.hotel-photo-lightbox__nav')

    gsap.killTweensOf(
      [
        imgEl,
        scrim,
        cap,
        closeBtn,
        ...(navNodes.length ? [...navNodes] : []),
      ].filter(Boolean),
    )
    lightboxCtxRef.current?.()
    lightboxCtxRef.current = null

    if (!imgEl || !scrim) {
      closingGuardRef.current = false
      dlg.close()
      return
    }

    const narrowClose = typeof window !== 'undefined' && window.innerWidth < 540
    imgEl.style.objectFit = narrowClose ? 'contain' : 'cover'

    const vr = imgEl.getBoundingClientRect()
    const thumbRect = readThumbRect(galleryFanRootRef.current, idx)
    const dest = thumbRect ?? {
      left: Math.round(window.innerWidth / 2 - 100),
      top: Math.round(window.innerHeight / 2 - 75),
      width: 200,
      height: 150,
    }

    const controls = /** @type {HTMLElement[]} */ ([closeBtn, ...navNodes, cap].filter(Boolean))

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        gsap.set(imgEl, {
          clearProps:
            'position,left,top,width,height,maxWidth,maxHeight,minWidth,minHeight,zIndex,x,y,rotate,scale,skew,borderRadius,opacity',
        })
        imgEl.style.removeProperty('object-fit')
        dlg.close()
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
        zIndex: 100,
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
  }, [reduced])

  if (!items.length) return null

  function openFromThumb(index, /** @type {import('react').MouseEvent<HTMLElement>} */ event) {
    const imgEl = /** @type {HTMLElement | null} */ (event.currentTarget)?.querySelector('img')
    if (imgEl && typeof imgEl.getBoundingClientRect === 'function') {
      const r = imgEl.getBoundingClientRect()
      setMorphFrom({ left: r.left, top: r.top, width: r.width, height: r.height })
    } else {
      setMorphFrom(null)
    }
    setViewerIndex(index)
  }

  const lightbox = (
    <dialog
      ref={dialogRef}
      className={`hotel-photo-lightbox ${reduced && viewerIndex !== null ? 'hotel-photo-lightbox--reduced-motion' : ''}`}
      aria-modal="true"
      aria-label="Foto ingrandita"
      onCancel={(e) => {
        if (closingGuardRef.current) {
          e.preventDefault()
          return
        }
        if (reduced) return
        e.preventDefault()
        requestClose()
      }}
      onClose={() => {
        closingGuardRef.current = false
        gsap.killTweensOf([lightboxImgRef.current, scrimRef.current].filter(Boolean))
        lightboxCtxRef.current?.()
        lightboxCtxRef.current = null
        setMorphFrom(null)
        setViewerIndex(null)
      }}
    >
      <div
        ref={scrimRef}
        role="presentation"
        className="hotel-photo-lightbox__scrim"
        aria-hidden
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) requestClose()
        }}
      />
      <div
        className="hotel-photo-lightbox__inner"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {n > 1 && viewerIndex !== null ? (
          <>
            <button
              type="button"
              className="hotel-photo-lightbox__nav hotel-photo-lightbox__nav--prev"
              aria-label="Immagine precedente"
              onClick={() => {
                setMorphFrom(null)
                setViewerIndex((v) => (typeof v !== 'number' ? 0 : (v - 1 + n) % n))
              }}
            >
              ‹
            </button>
            <button
              type="button"
              className="hotel-photo-lightbox__nav hotel-photo-lightbox__nav--next"
              aria-label="Immagine successiva"
              onClick={() => {
                setMorphFrom(null)
                setViewerIndex((v) => (typeof v !== 'number' ? 0 : (v + 1) % n))
              }}
            >
              ›
            </button>
          </>
        ) : null}
        {viewerIndex !== null && galleryPhotos[viewerIndex] ? (
          <figure className="hotel-photo-lightbox__figure">
            <div className="hotel-photo-lightbox__img-wrap">
              <button
                ref={closeBtnRef}
                type="button"
                className="hotel-photo-lightbox__close"
                aria-label="Chiudi"
                onClick={(e) => {
                  e.stopPropagation()
                  requestClose()
                }}
              >
                ×
              </button>
              <img
                key={galleryPhotos[viewerIndex].src}
                ref={lightboxImgRef}
                className="hotel-photo-lightbox__img"
                src={galleryPhotos[viewerIndex].src}
                alt={galleryPhotos[viewerIndex].alt}
                decoding="async"
                draggable={false}
              />
            </div>
            <figcaption ref={captionRef} className="hotel-photo-lightbox__caption" aria-hidden="true">
              {galleryPhotos[viewerIndex].alt}
            </figcaption>
          </figure>
        ) : null}
      </div>
    </dialog>
  )

  const useStaticLayout = reduced || narrowViewport

  if (useStaticLayout) {
    return (
      <>
        <div ref={galleryFanRootRef} className="hotel-colazione-fan hotel-colazione-fan--static">
          <div className="hotel-colazione-fan__grid-simple">
            {items.map((entry, idx) => (
              <button
                key={entry.photo.src}
                type="button"
                className="hotel-colazione-fan__thumb-trigger"
                data-hotel-gallery-thumb={idx}
                onClick={(e) => openFromThumb(idx, e)}
                aria-haspopup="dialog"
                aria-label={`Apri a schermo intero: ${entry.photo.alt}`}
              >
                <span className="hotel-colazione-fan__img-shell">
                  <img
                    src={entry.photo.src}
                    alt=""
                    width={360}
                    height={270}
                    decoding="async"
                    loading="lazy"
                    draggable={false}
                  />
                </span>
              </button>
            ))}
          </div>
        </div>
        {lightbox}
      </>
    )
  }

  const stackIndexed = [...items.map((entry, viewerIndexInner) => ({ ...entry, viewerIndex: viewerIndexInner }))].reverse()

  return (
    <>
      <div ref={galleryFanRootRef} className="hotel-colazione-fan">
        <div className="hotel-colazione-fan__backdrop" aria-hidden />
        <div className="hotel-colazione-fan__viewport">
          <motion.div
            className="hotel-colazione-fan__fade"
            initial={{ opacity: 0 }}
            animate={{ opacity: showVisible ? 1 : 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <motion.div
              className="hotel-colazione-fan__orbit"
              variants={containerVariants}
              initial="hidden"
              animate={showLoaded ? 'visible' : 'hidden'}
            >
              <div className="hotel-colazione-fan__stack">
                {stackIndexed.map(({ photo, spec, viewerIndex: vi }) => (
                  <motion.div
                    key={photo.src}
                    className="hotel-colazione-fan__slide"
                    style={{ zIndex: spec.zIndex }}
                    variants={photoVariants}
                    custom={{ x: spec.x, y: spec.y, order: spec.order }}
                  >
                    <motion.button
                      type="button"
                      className="hotel-colazione-fan__card"
                      data-hotel-gallery-thumb={vi}
                      aria-haspopup="dialog"
                      aria-label={`Apri a schermo intero: ${photo.alt}`}
                      onClick={(e) => openFromThumb(vi, e)}
                      whileHover={{
                        scale: 1.08,
                        rotateZ: spec.tiltSign * 2,
                        transition: { type: 'spring', stiffness: 320, damping: 18 },
                      }}
                      whileTap={{ scale: 1.06 }}
                    >
                      <div className="hotel-colazione-fan__img-shell">
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          width={220}
                          height={220}
                          draggable={false}
                          decoding="async"
                          loading="lazy"
                        />
                      </div>
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      {lightbox}
    </>
  )
}
