import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Login from "./pages/Login"
import DashboardRouter from "./pages/DashboardRouter"
import NotFound from "./pages/NotFound"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<DashboardRouter />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
