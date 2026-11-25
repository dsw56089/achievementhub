import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import { useMyAchievements } from '../hooks/useMyAchievements';
import { useGames } from '../hooks/useGames';
import { formatDate } from '../lib/format';
import {
  completionByGame,
  gameLabel,
  overallStats,
  recentlyUnlocked,
} from '../lib/progress';
import '../components/progres.css';

/** Ekran /profil — % ukończenia per gra i ostatnio zdobyte (funkcja 6). */
export default function ProfilePage() {
  const { achievements } = useMyAchievements();
  const { games, gamesById } = useGames();

  const overall = useMemo(() => overallStats(achievements), [achievements]);
  const perGame = useMemo(
    () => completionByGame(achievements, games),
    [achievements, games],
  );
  const recent = useMemo(() => recentlyUnlocked(achievements, 5), [achievements]);

  if (achievements.length === 0) {
    return (
      <section className="pg-page">
        <h1>Profil</h1>
        <p className="pg-empty">
          Brak danych do pokazania. <Link to="/nowe">Dodaj osiągnięcie</Link> lub{' '}
          <Link to="/odkrywaj">przeglądaj społeczność</Link>.
        </p>
      </section>
    );
  }

  return (
    <section className="pg-page">
      <h1>Profil</h1>

      <div className="pg-summary">
        <p className="pg-summary__big">{overall.percent}%</p>
        <p>
          Zdobyto {overall.unlocked} z {overall.total} osiągnięć
        </p>
        <ProgressBar
          value={overall.unlocked}
          max={overall.total}
          label="Ogólny postęp"
        />
      </div>

      <h2>Ukończenie według gier</h2>
      <ul className="pg-games">
        {perGame.map((game) => (
          <li key={game.gameId} className="pg-game">
            {game.cover && (
              <img className="pg-game__cover" src={game.cover} alt="" />
            )}
            <div className="pg-game__body">
              <p className="pg-game__name">
                {game.name} <span>{game.percent}%</span>
              </p>
              <ProgressBar
                value={game.unlocked}
                max={game.total}
                label={`Ukończenie: ${game.name}`}
              />
              <p className="pg-game__meta">
                {game.unlocked} / {game.total} osiągnięć
              </p>
            </div>
          </li>
        ))}
      </ul>

      <h2>Ostatnio zdobyte</h2>
      {recent.length === 0 ? (
        <p className="pg-empty">
          Jeszcze nic nie zdobyto. Zajrzyj do <Link to="/moje">Moich osiągnięć</Link>.
        </p>
      ) : (
        <ol className="pg-recent">
          {recent.map((a) => (
            <li key={a.id}>
              <strong>{a.title}</strong>
              <span>
                {gameLabel(gamesById, a.gameId)} · {formatDate(a.unlockedAt)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
