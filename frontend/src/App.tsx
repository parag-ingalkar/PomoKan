import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TodosPage from './pages/TodosPage'
import ProfilePage from './pages/ProfilePage'
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth';
import PomodoroPage from './pages/PomodoroPage'
import SettingsPage from './pages/SettingsPage'
import KanbanPage from './pages/KanbanPage'
import EisenhowerMatrixPage from './pages/EisenhoverMatrixPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<RequireAuth><Layout /></RequireAuth>}>
          <Route path="/todos" element={<TodosPage />} />
          <Route path="/pomodoro" element={<PomodoroPage />} />
          <Route path="/kanban" element={<KanbanPage />} />
          <Route path="/eisenhover-matrix" element={<EisenhowerMatrixPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
