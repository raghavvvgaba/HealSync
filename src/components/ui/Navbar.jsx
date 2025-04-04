import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full px-6 py-4 flex justify-between items-center bg-background text-text"
    >
      <div className="text-2xl font-bold tracking-tight">HealSync</div>
      <div className="space-x-4">
        <Link
          to="/signup"
          className="px-4 py-2 rounded-xl bg-primary text-background font-medium hover:bg-secondary transition"
        >
          Sign Up
        </Link>
        <Link
          to="/#contact" // keep as-is for now, or update based on your routing logic
          className="px-4 py-2 rounded-xl border border-primary text-primary hover:bg-primary hover:text-background transition"
        >
          Contact Us
        </Link>
      </div>
    </motion.nav>
  );
}
