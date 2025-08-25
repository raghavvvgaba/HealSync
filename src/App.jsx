import { Routes, Route, useLocation } from 'react-router-dom';
import React, { useEffect, useRef, useState, useLayoutEffect, Suspense, lazy } from 'react';
import PrivateRoute from './components/PrivateRoute';

// Lazy load page components for better code splitting
const LandingPage = lazy(() => import('./pages/LandingPage'));
const UserDashboard = lazy(() => import('./pages/User/UserDashboard'));
const MedicalHistoryPage = lazy(() => import('./components/MedicalHistoryPage'));
const Signup = lazy(() => import('./pages/Signup'));
const Login = lazy(() => import('./pages/Login'));
const UserLayout = lazy(() => import('./pages/User/UserLayout'));
const DoctorLayout = lazy(() => import('./pages/Doctor/DoctorLayout'));
const DoctorDashboard = lazy(() => import('./pages/Doctor/DoctorDashboard'));
const PatientProfilePage = lazy(() => import('./pages/Doctor/PatientProfilePage'));
const EditProfile = lazy(() => import('./pages/User/EditProfile'));
const Onboarding = lazy(() => import('./components/Onboarding'));
const Profile = lazy(() => import('./pages/User/Profile').then(module => ({ default: module.Profile })));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// https://www.hover.dev/components/navigation Use this for prebuilt components

// Scroll to top on route change to avoid preserved scroll positions between pages
const ScrollToTop = () => {
  const location = useLocation();
  useLayoutEffect(() => {
    // Disable browser scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Multiple scroll reset attempts
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Force another reset after micro-task
    Promise.resolve().then(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
    
  }, [location.pathname]);
  return null;
};

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
    <div className="relative min-h-screen w-full bg-background text-text">
      <ScrollToTop />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<PrivateRoute><UserLayout /></PrivateRoute>} >
            <Route index element={<UserDashboard />} />
            <Route path='onboarding' element={<Onboarding/>} />
            <Route path='medical-history' element={<MedicalHistoryPage />} />
            <Route path='edit-profile' element={<EditProfile />} />
            <Route path='view-profile' element={<Profile />} />
          </Route>
          <Route path="/doctor" element={<PrivateRoute><DoctorLayout /></PrivateRoute>} >
            <Route index element={<DoctorDashboard />} />
            <Route path="shared-profile/:shareId" element={<PatientProfilePage />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
