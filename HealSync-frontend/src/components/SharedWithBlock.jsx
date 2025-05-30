import { useState } from "react"
import { useForm } from "react-hook-form";
import { FaUserCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export const SharedWithBlock = () => {
    const [doctorFound, setDoctorFound] = useState(false);
    const [doctorDetails, setDoctorDetails] = useState({});

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const searchDoctor = (data) => {
        // TODO: Not found logic and frontend remaining
        setDoctorFound(true);
        const doctor = {
            fullname: "Dr. Pawan Pareek",
            id: data.doctorId
        };
        setDoctorDetails(doctor);
        reset(); // clears input after sharing
    };

    const stopSharing = () => {
        // TODO: automatic timeout for sharing
        setDoctorFound(false);
    };

    return (
      <div className="relative rounded-2xl h-auto p-4 shadow text-text flex flex-col gap-3 group overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-surface opacity-100 group-hover:opacity-60 rounded-2xl pointer-events-none transition-opacity duration-300 z-0" />
    
      {/* Content Layer */}
      <div className="relative z-10 flex flex-col gap-3 h-full">
        <h2 className="text-xl font-semibold mb-4">Shared With</h2>
        <AnimatePresence mode="wait">
          {!doctorFound ? (
            <motion.form
              key="input"
              onSubmit={handleSubmit(searchDoctor)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="flex flex-col gap-2 w-full"
            >
              {/* input + button row */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
                <input
                  {...register("doctorId", { required: "Doctor ID is required" })}
                  placeholder="Enter Doctor's ID"
                  className={`p-2 bg-surface border rounded-xl w-full sm:w-auto flex-1 transition-all focus:outline-none ${
                    errors.doctorId
                      ? "border-red-500 focus:ring-2 focus:ring-red-500"
                      : "border-gray-600/20 focus:ring-2 focus:ring-accent"
                  }`}
                />
                <button
                  type="submit"
                  className="text-sm md:text-base px-4 py-2 rounded-xl bg-primary dark:bg-secondary text-text hover:scale-105 transition-all w-full sm:w-28 hover:bg-accent dark:hover:bg-accent"
                >
                  Share
                </button>
              </div>
    
              {/* error message shown below row */}
              {errors.doctorId && (
                <span className="text-red-500 text-sm ml-1">{errors.doctorId.message}</span>
              )}
            </motion.form>
          ) : (
            <motion.div
              key="shared"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="flex justify-evenly items-center gap-4 bg-emerald-500/10 border-2 border-emerald-500 rounded-xl p-4"
            >
              <FaUserCircle size={40} className="text-accent" />
              {doctorDetails.fullname}
              <button
                onClick={stopSharing}
                className="text-sm md:text-base px-2 py-2 rounded-xl bg-red-500 dark:bg-red-900 text-text hover:scale-105 transition-all w-28 hover:bg-red-600 dark:hover:bg-red-600"
              >
                Stop sharing
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    
        
    );
};
