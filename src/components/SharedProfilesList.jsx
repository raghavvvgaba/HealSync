import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { getSharedProfiles } from '../utils/firestoreService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FaUser, FaCalendar, FaEye, FaSpinner } from 'react-icons/fa';

function SharedProfilesList() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [sharedProfiles, setSharedProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;
        fetchSharedProfiles();
    }, [user]);

    const fetchSharedProfiles = async () => {
        try {
            setLoading(true);
            const result = await getSharedProfiles(user.uid);
            
            if (result.success) {
                // Fetch patient names for each shared profile
                const profilesWithNames = await Promise.all(
                    result.data.map(async (share) => {
                        try {
                            const userDocRef = doc(db, "users", share.patientId);
                            const userDoc = await getDoc(userDocRef);
                            const patientName = userDoc.exists() ? userDoc.data().name : 'Unknown Patient';
                            const patientEmail = userDoc.exists() ? userDoc.data().email : '';
                            
                            return {
                                ...share,
                                patientName,
                                patientEmail
                            };
                        } catch (error) {
                            console.error(`Error fetching patient data for ${share.patientId}:`, error);
                            return {
                                ...share,
                                patientName: 'Unknown Patient',
                                patientEmail: ''
                            };
                        }
                    })
                );
                
                setSharedProfiles(profilesWithNames);
            } else {
                setError(result.error);
            }
        } catch (error) {
            console.error('Error fetching shared profiles:', error);
            setError('Failed to load shared profiles');
        } finally {
            setLoading(false);
        }
    };

    const viewProfile = (shareId) => {
        navigate(`/doctor/shared-profile/${shareId}`);
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Unknown';
        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            return date.toLocaleDateString();
        } catch (error) {
            return 'Unknown';
        }
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center py-8">
                    <FaSpinner className="animate-spin text-2xl text-primary" />
                    <span className="ml-2 text-gray-600 dark:text-gray-400">Loading shared profiles...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                    Error Loading Profiles
                </h3>
                <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
            </div>
        );
    }

    if (sharedProfiles.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Shared Patient Records
                </h2>
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <FaUser className="text-4xl mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">No patient records shared yet.</p>
                    <p className="text-sm">
                        Share your Doctor ID with patients to receive their medical records.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Shared Patient Records ({sharedProfiles.length})
                </h2>
            </div>
            
            <div className="p-6">
                <div className="space-y-4">
                    {sharedProfiles.map((profile) => (
                        <div 
                            key={profile.id}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FaUser className="text-primary" />
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {profile.patientName}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        {profile.patientEmail}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                                        <FaCalendar />
                                        <span>Shared on {formatDate(profile.sharedAt)}</span>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={() => viewProfile(profile.id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary dark:bg-secondary text-white rounded-lg hover:opacity-90 transition-all duration-200"
                                >
                                    <FaEye />
                                    View Profile
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SharedProfilesList;
