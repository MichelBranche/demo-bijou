export default function Wellness({ label, title, description, imageSrc, imageAlt, children }) {
  return (
    <section className="hotel-wellness-split hotel-block" aria-labelledby="hotel-wellness-heading">
      <div className="hotel-landing__container hotel-wellness-split__grid">
        <div className="hotel-wellness-split__text">
          <span className="label" data-reveal>
            {label}
          </span>
          <h2 id="hotel-wellness-heading" className="serif hotel-wellness-split__title" data-reveal>
            {title}
          </h2>
          <p className="hotel-wellness-split__lede" data-reveal>
            {description}
          </p>
          <div data-reveal>{children}</div>
        </div>
        <figure className="hotel-wellness-split__figure" data-reveal>
          <div className="hotel-wellness-split__media">
            <img src={imageSrc} alt={imageAlt} width={720} height={960} decoding="async" loading="lazy" />
          </div>
        </figure>
      </div>
    </section>
  )
}
