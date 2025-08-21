import React, { useState, useEffect } from 'react';
import UserHealthProfileBlock from '../../components/UserHealthProfileBlock';
import MedicalHistoryBlock from '../../components/MedicalHistoryBlock';
import SharedDoctorsBlock from '../../components/SharedDoctorsBlock';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/authContext';
import { getPatientMedicalRecords } from '../../utils/firestoreService';
import { FaUser, FaClock, FaBell } from 'react-icons/fa';

const dummyUser = {
    firstName: 'Ravi',
    lastName: 'Kumar',
    height: 172,
    bloodGroup: 'B+',
    diseases: ['Diabetes', 'High BP', 'Wears Specs'],
};

const UserDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    
    // State for medical records
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [recordsLoading, setRecordsLoading] = useState(true);
    const [recordsError, setRecordsError] = useState(null);

    // Fetch medical records when component mounts
    useEffect(() => {
        if (user?.uid) {
            fetchMedicalRecords();
        }
    }, [user]);

    const fetchMedicalRecords = async () => {
        try {
            setRecordsLoading(true);
            setRecordsError(null);
            
            const result = await getPatientMedicalRecords(
                user.uid,
                null,    // lastDoc for pagination
                20,      // pageSize - get latest 20 records
                false    // includeDeactivated - only active records
            );
            
            if (result.success) {
                setMedicalRecords(result.data || []);
            } else {
                setRecordsError(result.error || 'Failed to fetch medical records');
                setMedicalRecords([]);
            }
        } catch (error) {
            console.error('Error fetching medical records:', error);
            setRecordsError('Failed to load medical records');
            setMedicalRecords([]);
        } finally {
            setRecordsLoading(false);
        }
    };

    // Get current time greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
    <div className="min-h-screen bg-background p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">
                                {getGreeting()}, <span className="text-blue-600 dark:text-blue-400">{user?.displayName || user?.email?.split('@')[0] || 'User'}</span>
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 text-base">
                                Welcome to your health dashboard. <span className="inline-block bg-blue-50 dark:bg-blue-950 px-2 py-1 rounded text-blue-700 dark:text-blue-300 ml-1">Here's your overview for today.</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                            <FaClock className="text-blue-600 dark:text-blue-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                {new Date().toLocaleDateString('en-US', { 
                                    weekday: 'long',
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </span>
                        </div>
                        <button className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 relative">
                            <FaBell className="text-lg" />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Top Row - Profile and Health Overview */}
                    <div className="grid grid-cols-1 gap-6">
                        <UserHealthProfileBlock />
                    </div>

                    {/* Middle Row - Medical History */}
                    <div className="grid grid-cols-1 gap-6">
                                                {/* Medical History */}
                        <MedicalHistoryBlock 
                            records={medicalRecords}
                            loading={recordsLoading}
                            error={recordsError}
                            onRefresh={fetchMedicalRecords}
                        />
                    </div>

                </div>

                {/* Right Column */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Shared Doctors */}
                    <SharedDoctorsBlock />


                    {/* Health Tips Widget */}
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-green-200 dark:border-green-700">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                            💡 Health Tip of the Day
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            Stay hydrated! Aim to drink at least 8 glasses of water throughout the day to maintain optimal health and energy levels.
                        </p>
                        <button className="mt-3 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium">
                            Learn more →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
