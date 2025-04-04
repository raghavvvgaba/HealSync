import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import LandingPage from "./Pages/LandingPage";
import SignupForm from "./Pages/SignupForm";
import LoginPage from "./Pages/LoginPage";

// Dashboards
import DashboardHomeUser from "./Pages/user/DashboardUserHome";
import ProfileUser from "./Pages/user/ProfileUser";
import DashboardHomeDoctor from "./Pages/doctor/DashboardHomeDoctor";
import ProfileDoctor from "./Pages/doctor/ProfileDoctor";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginPage />} />

        {/* User Routes */}
        <Route path="/dashboard/user" element={<DashboardHomeUser />} />
        <Route path="/dashboard/user/profile" element={<ProfileUser />} />

        {/* Doctor Routes */}
        <Route path="/dashboard/doctor" element={<DashboardHomeDoctor />} />
        <Route path="/dashboard/doctor/profile" element={<ProfileDoctor />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
