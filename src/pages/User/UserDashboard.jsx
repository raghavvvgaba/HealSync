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
        <div className="min-h-screen bg-background aurora-bg">
            {/* Header - gradient ribbon */}
            <div className="relative bg-gradient-to-br from-primary/25 via-accent/20 to-transparent px-3 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6 border-b soft-divider">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
                    <div className="flex items-start gap-4 sm:gap-5">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl glass flex items-center justify-center shadow-lg">
                            <FaUser className="text-primary text-xl sm:text-2xl" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text leading-tight break-words">
                                {getGreeting()}, <span className="text-primary">{user?.displayName || user?.email?.split('@')[0] || 'User'}</span>
                            </h1>
                            <div className="mt-3 inline-flex items-center gap-2 glass rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-secondary">
                                Your personalized health overview
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="glass rounded-xl sm:rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 flex items-center gap-3 shadow-lg">
                            <FaClock className="text-primary shrink-0" />
                            <div className="min-w-0">
                                <div className="text-[10px] sm:text-xs text-secondary">Today</div>
                                <div className="text-xs sm:text-sm font-semibold text-text truncate">
                                    {new Date().toLocaleDateString('en-US', {
                                        weekday: 'long', month: 'short', day: 'numeric'
                                    })}
                                </div>
                            </div>
                        </div>
                        <button className="relative rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-white shadow-xl bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 transition-all">
                            <FaBell className="text-base sm:text-lg" />
                            <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-accent shadow"></span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                {/* Left Column */}
                <div className="lg:col-span-8 space-y-6 sm:space-y-8 min-w-0">
                    <div className="min-w-0">
                        <UserHealthProfileBlock />
                    </div>
                    <div className="min-w-0">
                        <MedicalHistoryBlock 
                            records={medicalRecords}
                            loading={recordsLoading}
                            error={recordsError}
                            onRefresh={fetchMedicalRecords}
                        />
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-4 space-y-6 sm:space-y-8 min-w-0">
                    <SharedDoctorsBlock />

                    {/* Health Tips Widget */}
                    <div className="glass rounded-2xl p-5 sm:p-6 border soft-divider hover-glow-primary">
                        <h3 className="text-lg sm:text-xl font-bold text-text mb-3">💡 Health Tip of the Day</h3>
                        <p className="text-sm text-secondary leading-relaxed">
                            Stay hydrated! Aim to drink at least 8 glasses of water throughout the day to maintain optimal health and energy levels.
                        </p>
                        <button className="mt-3 text-sm text-primary hover:opacity-80 font-medium">
                            Learn more →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
