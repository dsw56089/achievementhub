import { Link } from 'react-router-dom'
import { ArrowUpRight, Trophy } from 'lucide-react'
import ProgressBar from './ProgressBar'

export default function GameCard({ game, progress }) {
  return (
    <Link to={`/gry/${game.id}`} className="game-card">
      <div className="game-cover-wrap">
        <img src={game.cover} alt="" className="game-cover" />
        <div className="cover-shade" />
        <span className="game-year">{game.year}</span>
        <span className="cover-arrow"><ArrowUpRight size={18} /></span>
        <div className="cover-title">
          <span className="eyebrow">{game.genre}</span>
          <h3>{game.title}</h3>
        </div>
      </div>
      <div className="game-card-body">
        <div className="card-progress-heading">
          <span><Trophy size={14} /> Twój progres</span>
          <strong>{progress.percent}%</strong>
        </div>
        <ProgressBar value={progress.percent} accent={game.accent} />
        <div className="card-meta">
          <span>{progress.count} / {progress.total} osiągnięć</span>
          <span>{game.achievements.filter((a) => a.custom).length} społecznościowych</span>
        </div>
      </div>
    </Link>
  )
}
