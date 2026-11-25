import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Gamepad2, Monitor, Plus, Sparkles, Trophy } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import ProgressBar from '../components/ProgressBar'
import AchievementRow from '../components/AchievementRow'

export default function GameDetails() {
  const { id } = useParams()
  const { games, completed, pinned, toggleCompleted, togglePinned, getProgress } = useApp()
  const [filter, setFilter] = useState('Wszystkie')
  const game = games.find((item) => item.id === id)

  const achievements = useMemo(() => game?.achievements.filter((item) => {
    if (filter === 'Społecznościowe') return item.custom
    if (filter === 'Zdobyte') return completed.includes(item.id)
    if (filter === 'Do zdobycia') return !completed.includes(item.id)
    return true
  }) || [], [game, filter, completed])

  if (!game) return <div className="content-wrap"><div className="not-found"><h1>Nie znaleziono gry</h1><Link to="/gry" className="back-link">Wróć do katalogu</Link></div></div>

  const progress = getProgress(game)
  const customCount = game.achievements.filter((a) => a.custom).length

  return (
    <div className="game-detail-page">
      <div className="detail-back content-wrap"><Link to="/gry" className="back-link"><ArrowLeft size={16}/> Wróć do katalogu</Link></div>
      <section className="game-hero" style={{'--game-accent': game.accent}}>
        <img src={game.cover} alt="" className="game-hero-image"/>
        <div className="game-hero-overlay"/>
        <div className="game-hero-content content-wrap">
          <div className="game-hero-copy">
            <span className="eyebrow">{game.genre} <span className="dot-separator">•</span> {game.year}</span>
            <h1>{game.title}</h1>
            <p>{game.description}</p>
            <div className="game-facts"><span><CalendarDays size={15}/>{game.year}</span><span><Monitor size={15}/>{game.platform}</span><span><Gamepad2 size={15}/>{game.developer}</span></div>
          </div>
          <div className="progress-card">
            <div className="progress-card-top"><span>TWÓJ POSTĘP</span><Trophy size={18}/></div>
            <strong className="big-percent">{progress.percent}<small>%</small></strong>
            <ProgressBar value={progress.percent} accent={game.accent}/>
            <div className="progress-card-bottom"><span>{progress.count} zdobytych</span><span>{progress.total} łącznie</span></div>
          </div>
        </div>
      </section>

      <div className="content-wrap detail-content">
        <div className="section-heading achievement-heading">
          <div><span className="eyebrow">KOLEKCJA WYZWAŃ</span><h2>Osiągnięcia <span className="count-pill">{game.achievements.length}</span></h2><p className="section-description">{customCount} osiągnięć dodanych przez społeczność</p></div>
          <button className="outline-action"><Plus size={16}/> Zaproponuj osiągnięcie</button>
        </div>
        <div className="achievement-toolbar">
          <div className="filter-tabs">{['Wszystkie','Do zdobycia','Zdobyte','Społecznościowe'].map((name)=><button key={name} onClick={()=>setFilter(name)} className={filter===name?'selected':''}>{name}</button>)}</div>
          <span className="results-count">{achievements.length} wyników</span>
        </div>
        <div className="achievement-list">
          {achievements.map((achievement)=><AchievementRow key={achievement.id} achievement={achievement} isCompleted={completed.includes(achievement.id)} isPinned={pinned.includes(achievement.id)} onToggle={()=>toggleCompleted(achievement.id)} onPin={()=>togglePinned(achievement.id)}/>)}
          {!achievements.length && <div className="empty-state">Brak osiągnięć w tej kategorii.</div>}
        </div>
        <div className="community-note"><div className="note-icon"><Sparkles size={18}/></div><div><strong>Osiągnięcia tworzy społeczność</strong><p>Przypinaj wyzwania, do których chcesz szybko wracać, i odhaczaj je po zdobyciu. Twoje postępy zapisują się lokalnie w tej przeglądarce.</p></div></div>
      </div>
    </div>
  )
}
