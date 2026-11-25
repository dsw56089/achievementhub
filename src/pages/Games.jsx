import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, Gamepad2, Sparkles, Trophy } from 'lucide-react'
import { useApp } from '../context/AppContext'
import GameCard from '../components/GameCard'

export default function Games() {
  const { games, getProgress } = useApp()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('Wszystkie')
  const filtered = useMemo(() => games.filter((game) => {
    const matchesQuery = `${game.title} ${game.genre}`.toLowerCase().includes(query.toLowerCase())
    const matchesFilter = filter === 'Wszystkie' || (filter === 'W trakcie' ? getProgress(game).percent > 0 && getProgress(game).percent < 100 : filter === 'Nie rozpoczęte' ? getProgress(game).percent === 0 : getProgress(game).percent === 100)
    return matchesQuery && matchesFilter
  }), [games, query, filter, getProgress])

  const totalAchievements = games.reduce((sum, game) => sum + game.achievements.length, 0)
  return (
    <div className="content-wrap">
      <section className="welcome-row">
        <div>
          <div className="eyebrow purple"><Sparkles size={13} /> TWOJA BAZA OSIĄGNIĘĆ</div>
          <h1>Witaj w <span>Achievement Hub.</span></h1>
          <p className="lead">Odkrywaj nowe wyzwania. Zbieraj osiągnięcia. Graj po swojemu.</p>
        </div>
        <div className="hero-emblem"><Trophy size={34} /><span>LEVEL<br/><b>01</b></span></div>
      </section>

      <section className="stats-strip">
        <div className="stat-item"><span className="stat-icon"><Gamepad2 size={17}/></span><div><strong>{games.length}</strong><small>Gier w katalogu</small></div></div>
        <div className="stat-item"><span className="stat-icon gold"><Trophy size={17}/></span><div><strong>{totalAchievements}</strong><small>Dostępnych osiągnięć</small></div></div>
        <div className="stat-item"><span className="stat-icon green"><Sparkles size={17}/></span><div><strong>{games.reduce((n,g)=>n+g.achievements.filter(a=>a.custom).length,0)}</strong><small>Od społeczności</small></div></div>
      </section>

      <section className="catalog-section">
        <div className="section-heading">
          <div><span className="eyebrow">BIBLIOTEKA</span><h2>Twoje gry <span className="count-pill">{games.length}</span></h2></div>
          <div className="catalog-tools">
            <label className="search-box"><Search size={17}/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Szukaj gry..." /></label>
            <label className="filter-box"><SlidersHorizontal size={16}/><select value={filter} onChange={(e)=>setFilter(e.target.value)}><option>Wszystkie</option><option>W trakcie</option><option>Nie rozpoczęte</option><option>Ukończone</option></select></label>
          </div>
        </div>
        {filtered.length ? <div className="games-grid">{filtered.map((game)=><GameCard key={game.id} game={game} progress={getProgress(game)} />)}</div> : <div className="empty-state">Nie znaleziono gier pasujących do wyszukiwania.</div>}
      </section>
    </div>
  )
}
