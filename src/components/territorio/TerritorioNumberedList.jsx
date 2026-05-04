/** @param {{ items: string[] }} props */
export default function TerritorioNumberedList({ items }) {
  return (
    <ol className="territorio-numlist">
      {items.map((text, i) => (
        <li key={i} className="territorio-numlist__item">
          <span className="territorio-numlist__badge" aria-hidden />
          <span>{text}</span>
        </li>
      ))}
    </ol>
  )
}
