import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FaCopy, FaCheck } from 'react-icons/fa';

function DoctorIdDisplay() {
    const { user } = useAuth();
    const [doctorId, setDoctorId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchDoctorId = async () => {
            if (!user) return;

            try {
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);
                
                if (userDoc.exists() && userDoc.data().doctorId) {
                    setDoctorId(userDoc.data().doctorId);
                }
            } catch (error) {
                console.error("Error fetching doctor ID:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorId();
    }, [user]);

    const handleCopy = async () => {
        if (!doctorId) return;
        
        try {
            await navigator.clipboard.writeText(doctorId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy doctor ID:", error);
        }
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-3"></div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                </div>
            </div>
        );
    }

    if (!doctorId) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                    Doctor ID Not Found
                </h3>
                <p className="text-red-600 dark:text-red-300 text-sm">
                    Your doctor ID was not found. Please contact support if this issue persists.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Your Doctor ID
                </h3>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">
                    Share with Patients
                </span>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border">
                    <code className="text-lg font-mono font-bold text-primary dark:text-secondary">
                        {doctorId}
                    </code>
                </div>
                
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-primary dark:bg-secondary text-white rounded-lg hover:opacity-90 transition-all duration-200"
                    title="Copy Doctor ID"
                >
                    {copied ? <FaCheck className="text-sm" /> : <FaCopy className="text-sm" />}
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                    How patients can share with you:
                </h4>
                <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-1 ml-4 list-decimal">
                    <li>Ask your patients to use the "Share to Doctor" button on their profile</li>
                    <li>They should enter your Doctor ID: <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">{doctorId}</code></li>
                    <li>You'll receive access to their medical records and profile</li>
                </ol>
            </div>
        </div>
    );
}

export default DoctorIdDisplay;
