import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { games as mockGames } from '../data/mockData'
import {
  completeOneTime,
  incrementProgress,
  resetProgress,
  updateById,
  getTarget,
  getProgress,
} from '../modules/progres/lib/progress'

/**
 * Wspólny stan „Moich osiągnięć” (localStorage: myAchievements).
 * Używają go: Kreator (add/update/delete), Progres (increment/complete/reset), Społeczność (add).
 *
 * Kształt osiągnięcia:
 * { id, gameId, title, description, type: 'licznik'|'jednorazowe', target, progress, unlockedAt }
 */
export const STORAGE_KEY = 'myAchievements'

const AchievementsContext = createContext(null)

function read() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const newId = () =>
  globalThis.crypto?.randomUUID?.() ?? `a-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export function AchievementsProvider({ children }) {
  // gry z mocka Rafała: title -> name, żeby pasowały do formatu { id, name, cover }
  const games = useMemo(
    () => mockGames.map((g) => ({ id: g.id, name: g.title, cover: g.cover })),
    [],
  )
  const [myAchievements, setMyAchievements] = useState(read)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(myAchievements))
    } catch {
      /* pełny/zablokowany localStorage — działamy dalej w pamięci */
    }
  }, [myAchievements])

  const addAchievement = useCallback((data) => {
    const type = data.type === 'licznik' ? 'licznik' : 'jednorazowe'
    const item = {
      id: newId(),
      gameId: data.gameId,
      title: data.title.trim(),
      description: (data.description || '').trim(),
      type,
      target: type === 'licznik' ? Number(data.target) : 1,
      progress: 0,
      unlockedAt: null,
    }
    setMyAchievements((list) => [...list, item])
    return item
  }, [])

  // edycja nie rusza id; progres przycinany do nowego celu, a przy osiągnięciu celu ustawia się data
  const updateAchievement = useCallback((id, data) => {
    setMyAchievements((list) =>
      updateById(list, id, (a) => {
        const type = data.type === 'licznik' ? 'licznik' : 'jednorazowe'
        const next = {
          ...a,
          gameId: data.gameId,
          title: data.title.trim(),
          description: (data.description || '').trim(),
          type,
          target: type === 'licznik' ? Number(data.target) : 1,
        }
        const target = getTarget(next)
        next.progress = Math.min(getProgress(a), target)
        next.unlockedAt = next.progress >= target ? a.unlockedAt || new Date().toISOString() : null
        return next
      }),
    )
  }, [])

  const deleteAchievement = useCallback(
    (id) => setMyAchievements((list) => list.filter((a) => a.id !== id)),
    [],
  )
  const increment = useCallback(
    (id) => setMyAchievements((l) => updateById(l, id, (a) => incrementProgress(a))),
    [],
  )
  const complete = useCallback(
    (id) => setMyAchievements((l) => updateById(l, id, (a) => completeOneTime(a))),
    [],
  )
  const reset = useCallback(
    (id) => setMyAchievements((l) => updateById(l, id, resetProgress)),
    [],
  )

  const value = useMemo(
    () => ({
      games,
      myAchievements,
      setMyAchievements,
      addAchievement,
      updateAchievement,
      deleteAchievement,
      increment,
      complete,
      reset,
    }),
    [games, myAchievements, addAchievement, updateAchievement, deleteAchievement, increment, complete, reset],
  )

  return <AchievementsContext.Provider value={value}>{children}</AchievementsContext.Provider>
}

export function useAchievements() {
  const ctx = useContext(AchievementsContext)
  if (!ctx) throw new Error('useAchievements musi być użyty wewnątrz AchievementsProvider')
  return ctx
}
