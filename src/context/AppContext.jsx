import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { games as initialGames } from '../data/mockData'

const AppContext = createContext(null)
const STORAGE_KEY = 'achievement-hub-state-v1'

export function AppProvider({ children }) {
  const [games] = useState(initialGames)
  const [completed, setCompleted] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"completed":[],"downloaded":[],"pinned":[]}')
      return { ...saved, pinned: saved.pinned || saved.downloaded || [] }
    } catch {
      return { completed: [], downloaded: [], pinned: [] }
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed))
  }, [completed])

  const toggleCompleted = (achievementId) => {
    setCompleted((current) => ({
      ...current,
      completed: current.completed.includes(achievementId)
        ? current.completed.filter((id) => id !== achievementId)
        : [...current.completed, achievementId],
    }))
  }

  const togglePinned = (achievementId) => {
    setCompleted((current) => ({
      ...current,
      pinned: (current.pinned || []).includes(achievementId)
        ? current.pinned.filter((id) => id !== achievementId)
        : [...(current.pinned || []), achievementId],
    }))
  }

  const value = useMemo(() => ({
    games,
    completed: completed.completed,
    pinned: completed.pinned || [],
    toggleCompleted,
    togglePinned,
    getProgress: (game) => {
      const ids = game.achievements.map((item) => item.id)
      const count = ids.filter((id) => completed.completed.includes(id)).length
      return { count, total: ids.length, percent: ids.length ? Math.round((count / ids.length) * 100) : 0 }
    },
  }), [games, completed])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp musi być użyty wewnątrz AppProvider')
  return context
}
