export default function Hero({ label, title, description, images }) {
  return (
    <header className="hotel-hero">
      <div className="hotel-landing__container hotel-hero__intro">
        <span className="label hotel-hero__label">{label}</span>
        <h1 className="serif hotel-hero__title">{title}</h1>
        <div className="hotel-hero__lede">{description}</div>
      </div>
      <div className="hotel-landing__container hotel-hero__grid" aria-hidden={false}>
        {images.map(({ src, alt }, i) => (
          <figure key={src} className="hotel-hero__figure">
            <div className="hotel-hero__media">
              <div className="hotel-hero__media-inner">
                <img src={src} alt={alt} width={960} height={640} decoding="async" loading={i === 0 ? 'eager' : 'lazy'} />
              </div>
            </div>
          </figure>
        ))}
      </div>
    </header>
  )
}
