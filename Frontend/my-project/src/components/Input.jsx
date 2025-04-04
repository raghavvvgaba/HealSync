import { motion } from 'framer-motion';

export function Input({ type = "text", className = "", ...props }) {
  return (
    <motion.input
      type={type}
      whileFocus={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className={`w-full px-4 py-2 rounded-md border border-secondary bg-background text-text 
        placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
      {...props}
    />
  );
}
