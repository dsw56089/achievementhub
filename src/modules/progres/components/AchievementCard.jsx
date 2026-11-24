import ProgressBar from './ProgressBar';
import { TYPE, getProgress, getTarget, isUnlocked } from '../lib/progress';
import { formatDate } from '../lib/format';
import './progres.css';

/**
 * Karta osiągnięcia z postępem.
 *
 * `actions` to miejsce na dodatkowe przyciski innych modułów
 * (np. „Edytuj” / „Usuń” z funkcji 4 — @IgiBial).
 */
export default function AchievementCard({
  achievement,
  gameName,
  onIncrement,
  onComplete,
  onReset,
  actions,
}) {
  const unlocked = isUnlocked(achievement);
  const isCounter = achievement.type === TYPE.COUNTER;
  const target = getTarget(achievement);
  const progress = getProgress(achievement);

  return (
    <article className={`pg-card${unlocked ? ' pg-card--done' : ''}`}>
      <header className="pg-card__head">
        <h3 className="pg-card__title">{achievement.title}</h3>
        {unlocked && <span className="pg-badge">Zdobyte</span>}
      </header>

      {gameName && <p className="pg-card__game">{gameName}</p>}
      {achievement.description && (
        <p className="pg-card__desc">{achievement.description}</p>
      )}

      <ProgressBar
        value={progress}
        max={target}
        label={`Postęp: ${achievement.title}`}
      />

      {isCounter && (
        <p className="pg-card__count">
          {progress} / {target}
        </p>
      )}

      {unlocked && (
        <p className="pg-card__date">
          Zdobyte {formatDate(achievement.unlockedAt)}
        </p>
      )}

      <div className="pg-card__actions">
        {!unlocked && isCounter && (
          <button type="button" onClick={() => onIncrement(achievement.id)}>
            +1
          </button>
        )}
        {!unlocked && !isCounter && (
          <button type="button" onClick={() => onComplete(achievement.id)}>
            Odhacz
          </button>
        )}
        {unlocked && onReset && (
          <button
            type="button"
            className="pg-btn--ghost"
            onClick={() => onReset(achievement.id)}
          >
            Cofnij
          </button>
        )}
        {actions}
      </div>
    </article>
  );
}
