import { Coffee, Sofa } from 'lucide-react'

const icons = {
  sofa: Sofa,
  coffee: Coffee,
}

export default function SectionIntro({ id, headingId, icon = 'sofa', label, title, children }) {
  const Icon = icons[icon] ?? Sofa
  const hid = headingId ?? (id ? `${id}-heading` : 'section-intro-heading')
  return (
    <section className="hotel-section-intro hotel-block" id={id} aria-labelledby={hid}>
      <div className="hotel-landing__container">
        {label ? <span className="label hotel-section-intro__eyebrow">{label}</span> : null}
        <div className="hotel-section-intro__row">
          <div className="hotel-section-intro__icon" aria-hidden="true" data-reveal>
            <Icon strokeWidth={1.25} size={22} />
          </div>
          <div className="hotel-section-intro__copy">
            <h2 className="serif hotel-section-intro__title" id={hid} data-reveal>
              {title}
            </h2>
            <div className="hotel-section-intro__body" data-reveal>
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
