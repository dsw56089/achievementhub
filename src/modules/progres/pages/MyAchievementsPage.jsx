import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AchievementCard from '../components/AchievementCard';
import { useMyAchievements } from '../hooks/useMyAchievements';
import { useGames } from '../hooks/useGames';
import { SEED_ACHIEVEMENTS } from '../dev/seedAchievements';
import { STATUS, countByStatus, filterByStatus, gameLabel } from '../lib/progress';
import '../components/progres.css';

const FILTERS = [
  { value: STATUS.ALL, label: 'Wszystkie', countKey: 'all' },
  { value: STATUS.IN_PROGRESS, label: 'W toku', countKey: 'inProgress' },
  { value: STATUS.UNLOCKED, label: 'Zdobyte', countKey: 'unlocked' },
];

/** Ekran /moje — śledzenie progresu (funkcja 5). */
export default function MyAchievementsPage() {
  const { achievements, setAchievements, increment, complete, reset } =
    useMyAchievements();
  const { gamesById } = useGames();

  const [status, setStatus] = useState(STATUS.ALL);
  const [gameId, setGameId] = useState('');

  const counts = useMemo(() => countByStatus(achievements), [achievements]);

  const gameIds = useMemo(
    () => [...new Set(achievements.map((a) => String(a.gameId)))],
    [achievements],
  );

  const visible = useMemo(() => {
    const byGame = gameId
      ? achievements.filter((a) => String(a.gameId) === gameId)
      : achievements;
    return filterByStatus(byGame, status);
  }, [achievements, status, gameId]);

  function handleReset(id) {
    if (window.confirm('Zresetować postęp tego osiągnięcia?')) reset(id);
  }

  if (achievements.length === 0) {
    return (
      <section className="pg-page">
        <h1>Moje osiągnięcia</h1>
        <p className="pg-empty">
          Nie masz jeszcze żadnych osiągnięć.{' '}
          <Link to="/nowe">Utwórz własne</Link> albo{' '}
          <Link to="/odkrywaj">pobierz ze społeczności</Link>.
        </p>
        {import.meta.env.DEV && (
          <button type="button" onClick={() => setAchievements(SEED_ACHIEVEMENTS)}>
            Dodaj przykładowe dane (tylko dev)
          </button>
        )}
      </section>
    );
  }

  return (
    <section className="pg-page">
      <h1>Moje osiągnięcia</h1>

      <div className="pg-toolbar">
        <div className="pg-filters" role="group" aria-label="Filtr statusu">
          {FILTERS.map(({ value, label, countKey }) => (
            <button
              key={value}
              type="button"
              className="pg-filter"
              aria-pressed={status === value}
              onClick={() => setStatus(value)}
            >
              {label} ({counts[countKey]})
            </button>
          ))}
        </div>

        <label className="pg-select">
          Gra:{' '}
          <select value={gameId} onChange={(e) => setGameId(e.target.value)}>
            <option value="">Wszystkie gry</option>
            {gameIds.map((id) => (
              <option key={id} value={id}>
                {gameLabel(gamesById, id)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {visible.length === 0 ? (
        <p className="pg-empty">Brak osiągnięć dla wybranych filtrów.</p>
      ) : (
        <ul className="pg-grid">
          {visible.map((achievement) => (
            <li key={achievement.id}>
              <AchievementCard
                achievement={achievement}
                gameName={gameLabel(gamesById, achievement.gameId)}
                onIncrement={increment}
                onComplete={complete}
                onReset={handleReset}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
