import { useAchievements } from '../../../context/AchievementsContext'

/** Moduł Progres czyta „Moje osiągnięcia” ze wspólnego Contextu (AchievementsContext). */
export function useMyAchievements() {
  const { myAchievements, setMyAchievements, increment, complete, reset } = useAchievements()
  return { achievements: myAchievements, setAchievements: setMyAchievements, increment, complete, reset }
}
