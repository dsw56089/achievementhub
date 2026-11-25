import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Games from './pages/Games'
import GameDetails from './pages/GameDetails'
import Discover from './pages/Discover'
import Pinned from './pages/Pinned'
import { MyAchievementsPage, ProfilePage } from './modules/progres'
import AchievementForm from './components/creator/AchievementForm'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/gry" replace />} />
        <Route path="/gry" element={<Games />} />
        <Route path="/gry/:id" element={<GameDetails />} />
        <Route path="/odkrywaj" element={<Discover />} />
        <Route path="/przypiete" element={<Pinned />} />
        <Route path="/moje" element={<MyAchievementsPage />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="/nowe" element={<AchievementForm mode="create" />} />
        <Route path="/edytuj/:id" element={<AchievementForm mode="edit" />} />
        <Route path="*" element={<Navigate to="/gry" replace />} />
      </Route>
    </Routes>
  )
}
