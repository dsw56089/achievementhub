import { Link } from 'react-router-dom'
import { Compass, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Discover() {
  const { games } = useApp()
  const items = games.flatMap((game) => game.achievements.filter((a) => a.custom).map((achievement) => ({ ...achievement, game })))
  return <div className="content-wrap discover-page">
    <div className="eyebrow purple"><Compass size={13}/> SPOŁECZNOŚĆ</div>
    <h1>Odkrywaj <span>nowe wyzwania.</span></h1>
    <p className="lead">Niestandardowe osiągnięcia stworzone przez graczy, dla graczy.</p>
    <div className="discover-grid">{items.map((item)=><Link to={`/gry/${item.game.id}`} className="discover-card" key={item.id}>
      <div className="discover-card-top"><Sparkles size={16}/><span>{item.game.title}</span></div>
      <h3>{item.title}</h3><p>{item.description}</p>
      <div className="discover-card-foot"><span>Autor: {item.author}</span><span>{item.points} XP</span></div>
    </Link>)}</div>
  </div>
}
