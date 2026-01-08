import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from './pages/Login/AdminLogin'
import Dashboard from './pages/dashboard/Dashboard';
import Zonemanagers from './pages/zonemanagers/Zonemanagers';
import ManageDoulas from './pages/manageDoulas/ManageDoulas';
import Bookings from './pages/bookings/Bookings';
import Revenue from './pages/revenue/Revenue';
import Meetings from './pages/meetings/Meetings';
import Schedules from './pages/schedules/Schedules';
import Testimonials from './pages/testimonials/Testimonials';
import TestimonialView from './pages/testimonials/TestimonialView';
import MeetingDetails from './pages/meetings/MeetingDetails';
import ViewDoulaPage from './pages/manageDoulas/viewDoula';
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

        <Route path='/doulas' element={
          <PrivaterRoute>
            <ManageDoulas />
          </PrivaterRoute>
        } />

        <Route path='/doulas/:id' element={
          <PrivaterRoute>
            <ViewDoulaPage />
          </PrivaterRoute>
        } />

        <Route path='/bookings' element={
          <PrivaterRoute>
            <Bookings />
          </PrivaterRoute>
        } />

        <Route path='/revenue' element={
          <PrivaterRoute>
            <Revenue />
          </PrivaterRoute>
        } />

        <Route path='/meetings' element={
          <PrivaterRoute>
            <Meetings />
          </PrivaterRoute>
        } />

        <Route path='/meetings/:id' element={
          <PrivaterRoute>
            <MeetingDetails />
          </PrivaterRoute>
        } />

        <Route path='/schedules' element={
          <PrivaterRoute>
            <Schedules />
          </PrivaterRoute>
        } />

        <Route path='/testimonials' element={
          <PrivaterRoute>
            <Testimonials />
          </PrivaterRoute>
        } />

        <Route path='/testimonials/:id' element={
          <PrivaterRoute>
            <TestimonialView />
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
