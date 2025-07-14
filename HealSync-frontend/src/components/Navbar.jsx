import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/authContext";

const Navbar = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [showMenu, setShowMenu] = useState(false);
  const [showShareBox, setShowShareBox] = useState(false);
  const shareBoxRef = useRef(null);
  const { user, logout } = useAuth();
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
    <nav className="w-full h-16 px-6 py-4 bg-background text-text shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <motion.div
            className="text-2xl font-bold text-primary"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            HealSync
          </motion.div>
        </Link>

        {/* Right section */}
        <motion.div
          className="flex items-center gap-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {user ? (
            <div className="flex items-center gap-4 relative">
              {/* Share Button */}
              <div className="relative">
                <button
                  onClick={() => setShowShareBox((prev) => !prev)}
                  className="px-3 py-2 text-sm rounded-xl bg-secondary text-white hover:scale-105 transition"
                >
                  Share To Doctor
                </button>

                <AnimatePresence>
                  {showShareBox && (
                    <motion.form
                      ref={shareBoxRef}
                      onSubmit={handleSubmit((data) => {
                        console.log("Shared with:", data.shareTo);
                        reset();
                        setShowShareBox(false);
                      })}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-background border border-secondary rounded-xl shadow-xl z-50 p-4 space-y-2"
                    >
                      <label className="text-sm text-text">
                        Doctor's Email / ID
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Doctor's ID"
                        {...register("shareTo", { required: true })}
                        className="w-full px-3 py-2 border rounded-md border-gray-300 dark:border-gray-600 bg-transparent text-text"
                      />
                      <button
                        type="submit"
                        className="w-full px-3 py-2 bg-green-700 text-white rounded-md hover:opacity-90 transition"
                      >
                        Share Profile
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

              {/* Avatar Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setShowMenu(true)}
                onMouseLeave={() => setShowMenu(false)}
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-background font-bold text-lg cursor-pointer">
                  {user?.displayName?.charAt(0).toUpperCase()}
                </div>

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
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/signup"
                className="text-sm md:text-base px-4 py-2 rounded-xl bg-primary text-white hover:scale-105 transition"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="text-sm md:text-base px-4 py-2 rounded-xl bg-accent text-white hover:scale-105 transition"
              >
                Login
              </Link>
            </div>
          )}

          {/* Theme Toggle - Outside of conditional rendering */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-gray-300 dark:border-gray-600 hover:scale-110 transition"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <FiSun /> : <FiMoon />}
          </button>
        </motion.div>
      </div>
    </nav>
  );
};

export default Navbar;
