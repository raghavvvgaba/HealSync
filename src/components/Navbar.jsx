import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";

const Navbar = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <nav className="w-full px-6 py-4 bg-background dark:bg-background shadow-md text-text dark:text-text sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo / Project Name */}
        <motion.div
          className="text-2xl font-bold text-primary dark:text-primary"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          HealSync
        </motion.div>

        {/* Navigation Links */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
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
