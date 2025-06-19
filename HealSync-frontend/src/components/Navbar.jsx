import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";
import { useAuth } from "../context/authContext";

const Navbar = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [showMenu, setShowMenu] = useState(false);
  const {user, logout} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLogout = async () => {
    try {
            await logout();
            console.log("Logged out");
            navigate('/login');
        } catch (err) {
            console.log(err);
            console.log("Didn't logout");
        }
  };

  return (
    <nav className="w-full h-16 px-6 py-4 bg-background dark:bg-background shadow-md text-text dark:text-text sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo / Project Name */}
        <Link
          to='/'>
          <motion.div
            className="text-2xl font-bold text-primary dark:text-primary"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            HealSync
          </motion.div>
        </Link>

        {/* Navigation Links or Profile Section */}
        <motion.div
          className="flex items-center gap-4 relative"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {user ? (
            <div
              className="relative"
              onMouseEnter={() => setShowMenu(true)}
              onMouseLeave={() => setShowMenu(false)}
            >
              {/* Profile Circle */}
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-background font-bold text-lg cursor-pointer">
                {user?.displayName.charAt(0).toUpperCase()}
              </div>

              {/* Hover Dropdown */}
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-background border border-secondary rounded-xl shadow-xl z-50 p-4 text-sm"
                  >
                    <div className="font-semibold text-text mb-3">
                      {user?.displayName}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-md bg-accent text-background hover:opacity-90 transition"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                to="/signup"
                className="text-sm md:text-base px-4 py-2 rounded-xl bg-primary dark:bg-secondary text-text hover:scale-105 transition-all"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="text-sm md:text-base px-4 py-2 rounded-xl bg-accent text-text hover:scale-105 transition-all"
              >
                Login
              </Link>
            </>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="ml-2 p-2 rounded-full border border-gray-300 dark:border-gray-600 hover:scale-110 transition-all"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? (
              <FiSun className="text-xl text-secondary" />
            ) : (
              <FiMoon className="text-xl text-secondary" />
            )}
          </button>
        </motion.div>
      </div>
    </nav>
  );
};

export default Navbar;
