import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/authContext";
import HealSyncLogo from "../assets/HealSyncLogo.png";

const Navbar = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [showMenu, setShowMenu] = useState(false);
  const [showShareBox, setShowShareBox] = useState(false);
  const shareBoxRef = useRef(null);
  const { user, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shareBoxRef.current && !shareBoxRef.current.contains(e.target)) {
        setShowShareBox(false);
      }
    };

    if (showShareBox) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showShareBox]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log("Logged out");
      navigate("/login");
    } catch (err) {
      console.log("Logout failed", err);
    }
  };

  return (
    <nav className="w-full px-2 sm:px-4 text-text sticky top-3 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="relative flex flex-row justify-between items-center gap-2 rounded-2xl 
          glass px-3 sm:px-4 py-2">
        {/* Logo */}
        <Link to="/">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src={HealSyncLogo} 
              alt="HealSync Logo" 
              className="h-8 w-8 object-contain"
            />
            <span className="text-xl font-bold text-heading hidden sm:block">
              HealSync
            </span>
          </motion.div>
        </Link>

        {/* Right section */}
        <motion.div
          className="flex flex-row items-center gap-2 sm:gap-6 w-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {user ? (
            <div className="flex flex-row items-center gap-2 relative w-auto">
              {/* Avatar Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setShowMenu(true)}
                onMouseLeave={() => setShowMenu(false)}
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold text-lg cursor-pointer shadow-lg hover:scale-105 transition-transform">
                  {user?.displayName?.charAt(0).toUpperCase()}
                </div>

                <AnimatePresence>
                  {showMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-40 max-w-[80vw] sm:w-56 sm:max-w-xs rounded-xl z-[100] p-2 sm:p-4 text-sm pointer-events-auto 
                        glass-elevated"
                      style={{ minWidth: '140px' }}
                    >
                      <div className="font-semibold text-text mb-1 truncate">
                        {user?.displayName}
                      </div>
                      <div className="text-xs text-secondary mb-3 capitalize truncate">
                        {userRole || "Loading..."}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-md bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors font-medium"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="flex flex-row items-center gap-2 w-auto">
              <Link
                to="/signup"
                className="text-xs sm:text-sm md:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-xl glass-cta text-center min-w-[60px] sm:min-w-[80px]"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="text-xs sm:text-sm md:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-xl bg-transparent border border-primary text-primary hover:bg-primary/10 transition-colors text-center min-w-[60px] sm:min-w-[80px]"
              >
                Login
              </Link>
            </div>
          )}

          {/* Theme Toggle - Outside of conditional rendering */}
          <button
            onClick={toggleTheme}
            className="p-2 sm:p-2 rounded-full border border-primary/20 hover:bg-primary/5 transition hover:scale-110"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <FiSun className="text-amber-500" /> : <FiMoon className="text-blue-400" />}
          </button>
        </motion.div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;