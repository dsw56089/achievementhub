import { useMemo } from 'react'
import { useAchievements } from '../../../context/AchievementsContext'
import { indexGamesById } from '../lib/progress'

/** Gry ze wspólnego Contextu: { id, name, cover }. */
export function useGames() {
  const { games } = useAchievements()
  const gamesById = useMemo(() => indexGamesById(games), [games])
  return { games, gamesById, status: 'ready' }
}
