import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from './pages/Login/AdminLogin'

function PrivaterRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<PrivaterRoute><AdminLogin /></PrivaterRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
