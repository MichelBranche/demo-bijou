import { Check } from 'lucide-react'

/** @param {{ items: import('react').ReactNode[] }} props */
export default function TerritorioChecklist({ items }) {
  return (
    <ul className="territorio-checklist">
      {items.map((node, i) => (
        <li key={i} className="territorio-checklist__item">
          <Check className="territorio-checklist__icon" size={18} strokeWidth={2.25} aria-hidden />
          <span>{node}</span>
        </li>
      ))}
    </ul>
  )
}
