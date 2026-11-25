import { Check, Pin, PinOff, Sparkles, Trophy } from 'lucide-react'

export default function AchievementRow({ achievement, isCompleted, isPinned, onToggle, onPin }) {
  const rarity = achievement.rarity.toLowerCase()
  return (
    <article className={`achievement-row ${isCompleted ? 'is-completed' : ''}`}>
      <button className={`achievement-icon rarity-${rarity}`} onClick={onToggle} aria-label={isCompleted ? 'Cofnij zdobycie' : 'Oznacz jako zdobyte'}>
        {isCompleted ? <Check size={22} /> : <Trophy size={21} />}
      </button>
      <div className="achievement-info">
        <div className="achievement-title-line">
          <h3>{achievement.title}</h3>
          {achievement.custom && <span className="community-tag"><Sparkles size={11} /> Społecznościowe</span>}
        </div>
        <p>{achievement.description}</p>
        <div className="achievement-subline">
          <span className={`rarity-label rarity-text-${rarity}`}>{achievement.rarity}</span>
          <span>•</span>
          <span>Autor: <b>{achievement.author}</b></span>
        </div>
      </div>
      <div className="achievement-actions">
        <span className="points">+{achievement.points} XP</span>
        <button className={`download-btn ${isPinned ? 'downloaded' : ''}`} onClick={onPin} title={isPinned ? 'Odepnij osiągnięcie' : 'Przypnij osiągnięcie'}>
          {isPinned ? <><PinOff size={14} /> Przypięto</> : <><Pin size={14} /> Przypnij</>}
        </button>
      </div>
    </article>
  )
}
