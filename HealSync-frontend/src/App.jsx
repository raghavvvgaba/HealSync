import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import UserDashboard from './pages/User/UserDashboard';
import MedicalHistoryPage from './components/MedicalHistoryPage';
import { useEffect, useRef, useState } from 'react';
import Signup from './pages/Signup';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import UserLayout from './pages/User/UserLayout';
import DoctorLayout  from './pages/Doctor/DoctorLayout';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import EditProfile from './pages/User/EditProfile';

// https://www.hover.dev/components/navigation Use this for prebuilt components

const App = () => {
  const location = useLocation();

  // Direction logic
  const [direction, setDirection] = useState(1);
  const prevPathRef = useRef(location.pathname); 

  useEffect(() => {
    const prev = prevPathRef.current;
    const next = location.pathname;

    setDirection(next.length > prev.length ? 1 : -1);
    prevPathRef.current = next;
  }, [location]);

  return (
    <div className="relative h-[100vh] w-full bg-background text-text overflow-hidden">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<PrivateRoute><UserLayout /></PrivateRoute>} >
            <Route index element={<UserDashboard />} />
            <Route path='medical-history' element={<MedicalHistoryPage />} />
            <Route path='edit-profile' element={<EditProfile />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default App;
