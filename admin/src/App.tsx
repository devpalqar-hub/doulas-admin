import './App.css'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
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
import Regions from './pages/regions/Regions';
import EditRegion from './pages/regions/EditRegion';
import DoulaEnquiries from './pages/doulaEnquiry/DoulaEnquiries';

const PrivateRoute = () => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
    <Routes>
      {/* Public */}
      <Route path="/" element={<AdminLogin />} />

      {/* Protected */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/zonemanagers" element={<Zonemanagers />} />
        <Route path="/zonemanagers/:id" element={<ViewZoneManager />} />
        <Route path="/zone-managers/create" element={<CreateZoneManager />} />

        <Route path="/doulas" element={<ManageDoulas />} />
        <Route path="/doulas/:id" element={<ViewDoulaPage />} />

        <Route path="/doulasEnquiry" element={<DoulaEnquiries />} />

        <Route path="/regions" element={<Regions />} />
        <Route path="/regions/create" element={<EditRegion />} />
        <Route path="/regions/:id" element={<EditRegion />} />

        <Route path="/bookings" element={<Bookings />} />
        <Route path="/revenue" element={<Revenue />} />

        <Route path="/meetings" element={<Meetings />} />
        <Route path="/meetings/:id" element={<MeetingDetails />} />

        <Route path="/schedules" element={<Schedules />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/testimonials/:id" element={<TestimonialView />} />
      </Route>
    </Routes>
  </BrowserRouter>
  )
}

export default App
