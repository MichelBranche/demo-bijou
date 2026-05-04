import { forwardRef } from 'react'

const ImageGallery = forwardRef(function ImageGallery({ items }, ref) {
  return (
    <section className="hotel-gallery-pin" ref={ref} aria-label="Galleria colazione">
      <div className="hotel-gallery-pin__sticky">
        <div className="hotel-landing__container hotel-gallery-pin__viewport">
          <div className="hotel-gallery-pin__track">
            {items.map(({ src, alt }) => (
              <figure key={src} className="hotel-gallery-pin__cell">
                <div className="hotel-gallery-pin__mask">
                  <div className="hotel-gallery-pin__mask-inner">
                    <img src={src} alt={alt} width={640} height={480} decoding="async" loading="lazy" />
                  </div>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
})

export default ImageGallery
