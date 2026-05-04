export default function TerritorioHero({ label, title, intro, imageSrc, imageAlt, after }) {
  return (
    <header className="territorio-hero">
      <div className="territorio-landing__container">
        <div className="territorio-hero__inner">
          <span className="label territorio-hero__label">{label}</span>
          <h1 className="serif territorio-hero__title">{title}</h1>
          <p className="territorio-hero__intro">{intro}</p>
        </div>
        <figure className="territorio-hero__media">
          <div className="territorio-hero__media-inner">
            <img src={imageSrc} alt={imageAlt} width={1200} height={675} decoding="async" loading="eager" />
          </div>
        </figure>
        <p className="territorio-hero__after">{after}</p>
      </div>
    </header>
  )
}
