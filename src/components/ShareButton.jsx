import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

import { shareProfileWithDoctor } from '../utils/firestoreService';
import { useAuth } from '../context/authContext';

function ShareButton() {
    const { user } = useAuth();
    const [showShareBox, setShowShareBox] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [shareStatus, setShareStatus] = useState(null); // 'success', 'error', or null
    const [errorMessage, setErrorMessage] = useState('');
    const [doctorName, setDoctorName] = useState('');
    const shareBoxRef = useRef(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        if (!showShareBox) return;

        function handleClickOutside(event) {
            if (
                shareBoxRef.current &&
                !shareBoxRef.current.contains(event.target)
            ) {
                setShowShareBox(false);
                setShareStatus(null);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showShareBox]);

    const handleShare = async (data) => {
        if (!user) {
            setErrorMessage('You must be logged in to share your profile');
            setShareStatus('error');
            return;
        }

        setIsLoading(true);
        setShareStatus(null);
        setErrorMessage('');
        
        try {
            const doctorIdCode = data.doctorId.toUpperCase();
            
            // Share the profile with the doctor (function now handles doctor lookup internally)
            const shareResult = await shareProfileWithDoctor(
                user.uid, 
                doctorIdCode
            );
            
            if (shareResult.success) {
                setDoctorName(shareResult.doctorName || '');
                setShareStatus('success');
                setTimeout(() => {
                    reset();
                    setShowShareBox(false);
                    setShareStatus(null);
                    setErrorMessage('');
                    setDoctorName('');
                }, 2000);
            } else {
                setErrorMessage(shareResult.error || 'Failed to share profile');
                setShareStatus('error');
            }
            
        } catch (error) {
            console.error("Error sharing profile:", error);
            setErrorMessage('An unexpected error occurred. Please try again.');
            setShareStatus('error');
        }
        
        setIsLoading(false);
    };

    return (
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
                        onSubmit={handleSubmit(handleShare)}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-background border border-secondary rounded-xl shadow-xl z-50 p-4 space-y-3"
                    >
                        <label className="text-sm text-text font-medium">
                            Doctor's ID
                        </label>
                        <div className="space-y-1">
                            <input
                                type="text"
                                placeholder="e.g., DR-HALE-1234"
                                {...register("doctorId", { 
                                    required: "Doctor ID is required",
                                    pattern: {
                                        value: /^DR-[BCDFGHJKLMNPQRSTVWXYZAEIOU]{4}-\d{4}$/i,
                                        message: "Invalid doctor ID format (DR-XXXX-1234)"
                                    }
                                })}
                                className="w-full px-3 py-2 border rounded-md border-gray-300 dark:border-gray-600 bg-transparent text-text text-sm uppercase"
                                maxLength={12}
                            />
                            {errors.doctorId && (
                                <p className="text-red-500 text-xs">{errors.doctorId.message}</p>
                            )}
                            <p className="text-gray-500 text-xs">
                                Format: DR-XXXX-1234
                            </p>
                        </div>
                        
                        {shareStatus === 'error' && (
                            <div className="text-red-500 text-xs bg-red-50 p-2 rounded">
                                {errorMessage || 'An error occurred. Please try again.'}
                            </div>
                        )}
                        
                        {shareStatus === 'success' && (
                            <div className="text-green-600 text-xs bg-green-50 p-2 rounded">
                                Profile shared successfully{doctorName ? ` with Dr. ${doctorName}!` : '!'}
                            </div>
                        )}
                        
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-3 py-2 bg-green-700 text-white rounded-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            {isLoading ? "Sharing..." : "Share Profile"}
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
}

export default ShareButton;