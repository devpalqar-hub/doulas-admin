import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from './pages/Login/AdminLogin'
import Dashboard from './pages/dashboard/Dashboard';
import Zonemanagers from './pages/zonemanagers/Zonemanagers';
import CreateZoneManager from './pages/zonemanagers/CreateZoneManager'
import ViewZoneManager from "./pages/zonemanagers/ViewZoneManager";

function PrivaterRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AdminLogin />} />

        <Route path='/dashboard' element={
          <PrivaterRoute>
            <Dashboard />
          </PrivaterRoute>
        } />

        <Route path='/zonemanagers' element={
          <PrivaterRoute>
            <Zonemanagers />
          </PrivaterRoute>
        } />
         <Route
          path="/zone-managers/create"
          element={
            <PrivaterRoute>
              <CreateZoneManager />
            </PrivaterRoute>
          }/>
          <Route     
            path="/zonemanagers/:id"
            element={
              <PrivaterRoute>
                <ViewZoneManager />
              </PrivaterRoute>
            }
          />
      </Routes>
    </BrowserRouter>
  )
}

export default App
