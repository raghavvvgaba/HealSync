import { useState } from "react"
import { FaUserCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export const SharedWithBlock = () => {
    const [doctorFound, setDoctorFound] = useState(false);
    const [doctorDetails, setDoctorDetails] = useState({});

    function searchDoctor() {
        //TODO: not found logic and frontend remaining
        setDoctorFound(true);
        const doctor = {
            fullname: "Dr. Pawan Pareek",
            id: "123123"
        }
        setDoctorDetails(doctor);
    }

    function stopSharing() {
        //TODO: automatic timeout for sharing 
        setDoctorFound(false);
    }

    return <div className="bg-surface rounded-2xl h-60 p-4 shadow text-text flex flex-col gap-3">
        <h2 className="text-xl font-semibold mb-4">Shared With</h2>
        <AnimatePresence mode="wait">
            {!doctorFound ? (
                <motion.div
                    key="input"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="flex gap-4"
                >
                    <input
                        placeholder="Enter Doctor's ID"
                        className="p-2 bg-surface border border-gray-600/20 rounded-xl"
                    />
                    <button
                        onClick={searchDoctor}
                        className="text-sm md:text-base px-4 py-2 rounded-xl bg-primary dark:bg-secondary text-text hover:scale-105 transition-all w-28 hover:bg-accent dark:hover:bg-accent"
                    >
                        Share
                    </button>
                </motion.div>
            ) : (
                <motion.div
                    key="shared"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
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
}