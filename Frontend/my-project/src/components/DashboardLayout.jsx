import { motion } from "framer-motion";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-background text-text">
      {/* Sidebar */}
      <aside className="w-64 p-6 border-r border-secondary bg-secondary">
        <h2 className="text-xl font-semibold mb-6">HealSync</h2>
        <nav className="space-y-3">
          <a href="/dashboard" className="block hover:text-accent">Dashboard</a>
          <a href="/profile" className="block hover:text-accent">Profile</a>
          <a href="/records" className="block hover:text-accent">Medical Records</a>
          <a href="/appointments" className="block hover:text-accent">Appointments</a>
          <a href="/logout" className="block hover:text-accent">Logout</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
