import React, { useState, useEffect } from 'react';
import UserHealthProfileBlock from '../../components/UserHealthProfileBlock';
import MedicalHistoryBlock from '../../components/MedicalHistoryBlock';
import SharedDoctorsBlock from '../../components/SharedDoctorsBlock';
import AIHealthAssistant from '../../components/AIHealthAssistant';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/authContext';
import { getPatientMedicalRecords } from '../../utils/firestoreService';
import { FaUser, FaClock, FaBell, FaCommentDots } from 'react-icons/fa';

const dummyUser = {
    firstName: 'Ravi',
    lastName: 'Kumar',
    height: 172,
    bloodGroup: 'B+',
    diseases: ['Diabetes', 'High BP', 'Wears Specs'],
};

const UserDashboard = () => {
    const navigate = useNavigate();
    const { user, userProfile } = useAuth();
    
    // State for medical records
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [recordsLoading, setRecordsLoading] = useState(true);
    const [recordsError, setRecordsError] = useState(null);
    
    // State for AI Assistant
    const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

    // Check if onboarding is completed, redirect if not
    useEffect(() => {
        if (userProfile && userProfile.onboardingCompleted === false) {
            navigate('/user/onboarding');
        }
    }, [userProfile, navigate]);

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
    <div className="min-h-screen bg-background aurora-bg aurora-subtle pt-4">
            {/* Header - greeting */}
            <div className="relative glass px-4 sm:px-6 py-6 border-b soft-divider flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Greeting */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl glass flex items-center justify-center shadow-lg shrink-0">
                        <FaUser className="text-primary text-xl sm:text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-3xl font-bold text-text leading-tight">
                            {getGreeting()}, <span className="text-primary">{user?.displayName || user?.email?.split('@')[0] || 'User'}</span>
                        </h1>
                        <p className="text-xs sm:text-sm text-secondary font-medium">Your personalized health overview</p>
                    </div>
                </div>

                {/* Date & Notifications */}
                <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto mt-2 md:mt-0">
                    <div className="glass rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm border soft-divider flex-1 md:flex-none justify-center md:justify-start">
                        <FaClock className="text-primary shrink-0" />
                        <div>
                            <div className="text-[10px] text-secondary uppercase tracking-wider font-bold">Today</div>
                            <div className="text-sm font-semibold text-text whitespace-nowrap">
                                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </div>
                        </div>
                    </div>
                    <button className="relative w-12 h-12 md:w-10 md:h-10 flex items-center justify-center rounded-xl glass-cta shadow-lg transition-transform hover:scale-105 active:scale-95 shrink-0">
                        <FaBell className="text-lg" />
                        <span className="absolute top-3 right-3 md:top-2 md:right-2 w-2 h-2 rounded-full bg-red-500 shadow-sm border border-white/20"></span>
                    </button>
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
                </div>
            </div>

            {/* Floating AI Assistant Button */}
            <button
                onClick={() => setIsAIAssistantOpen(true)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-accent text-white rounded-full shadow-2xl hover:rotate-45 hover:shadow-accent/25 active:scale-95 transition-all duration-300 flex items-center justify-center z-40"
                title="Open AI Health Assistant"
            >
                <FaCommentDots className="text-xl" />
            </button>

            {/* AI Health Assistant Modal */}
            <AIHealthAssistant 
                isOpen={isAIAssistantOpen} 
                onClose={() => setIsAIAssistantOpen(false)} 
            />
        </div>
    );
};

export default UserDashboard;
