import { Link } from 'react-router-dom'
import { Pin, Trophy } from 'lucide-react'
import { useApp } from '../context/AppContext'
import AchievementRow from '../components/AchievementRow'

export default function Pinned() {
  const { games, pinned, completed, toggleCompleted, togglePinned } = useApp()
  const items = games.flatMap((game) => game.achievements
    .filter((achievement) => pinned.includes(achievement.id))
    .map((achievement) => ({ ...achievement, game })))

  return (
    <div className="content-wrap pinned-page">
      <div className="eyebrow purple"><Pin size={13}/> TWOJA KOLEKCJA</div>
      <h1>Przypięte <span>osiągnięcia.</span></h1>
      <p className="lead">Wszystkie wyzwania, do których chcesz mieć szybki dostęp.</p>
      <div className="pinned-summary">
        <strong>{items.filter((item) => completed.includes(item.id)).length}/{items.length}</strong>
        <span>przypiętych osiągnięć zdobytych</span>
      </div>
      {items.length ? (
        <div className="achievement-list pinned-list">
          {items.map((item) => (
            <div className="pinned-item" key={item.id}>
              <div className="pinned-game"><Link to={`/gry/${item.game.id}`}>{item.game.title}</Link></div>
              <AchievementRow
                achievement={item}
                isCompleted={completed.includes(item.id)}
                isPinned
                onToggle={() => toggleCompleted(item.id)}
                onPin={() => togglePinned(item.id)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state pinned-empty">
          Nie masz jeszcze przypiętych osiągnięć. Otwórz stronę gry i kliknij „Przypnij” przy wybranym wyzwaniu.
          <p><Link to="/gry">Przejdź do katalogu gier</Link></p>
        </div>
      )}
    </div>
  )
}
