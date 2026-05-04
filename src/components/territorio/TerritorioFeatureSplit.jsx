export default function TerritorioFeatureSplit({ id, title, subheading, imageSrc, imageAlt, children, ctaHref, ctaLabel }) {
  const titleId = `${id}-title`
  return (
    <section className="territorio-feature territorio-block" id={id} aria-labelledby={titleId}>
      <div className="territorio-landing__container">
        <header className="territorio-feature__head" data-reveal>
          <h2 id={titleId} className="territorio-feature__title serif">
            {title}
          </h2>
          <p className="territorio-feature__sub">{subheading}</p>
        </header>
        <div className="territorio-feature__grid">
          <figure className="territorio-feature__figure" data-reveal>
            <img src={imageSrc} alt={imageAlt} width={800} height={1000} decoding="async" loading="lazy" />
          </figure>
          <div className="territorio-feature__copy" data-reveal>
            {children}
            {ctaHref && ctaLabel ? (
              <a className="territorio-feature__link" href={ctaHref} target="_blank" rel="noopener noreferrer">
                {ctaLabel}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
