import { motion } from "framer-motion";
import { Spinner } from "./Spinner";

export default function LoadingScreen({ message = "Redirecting..." }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50"
    >
      <Spinner size={32} />
      <p className="mt-4 text-text text-lg font-medium">{message}</p>
    </motion.div>
  );
}
