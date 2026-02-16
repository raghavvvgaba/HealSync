import React, { useState } from 'react';
import DoctorIdDisplay from '../../components/DoctorIdDisplay';
import SharedProfilesList from '../../components/SharedProfilesList';
import AIHealthAssistant from '../../components/AIHealthAssistant';
import { useAuth } from '../../context/authContext';
import { FaClock, FaBell, FaUsers, FaHeartbeat, FaStethoscope, FaChartLine, FaCommentDots, FaUserMd } from 'react-icons/fa';

function DoctorDashboard() {
    const { user } = useAuth();
    const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
    <div className="min-h-screen bg-background aurora-bg aurora-subtle">
            {/* Header - greeting */}
            <div className="relative glass px-4 sm:px-6 py-6 border-b soft-divider flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Greeting */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl glass flex items-center justify-center shadow-lg shrink-0">
                        <FaUserMd className="text-primary text-xl sm:text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-3xl font-bold text-text leading-tight">
                            {getGreeting()}, <span className="text-primary">Dr. {user?.displayName?.split(' ')[1] || user?.displayName || 'Doctor'}</span>
                        </h1>
                        <p className="text-xs sm:text-sm text-secondary font-medium">Your medical practice dashboard</p>
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
                {/* Left column */}
                <div className="lg:col-span-8 space-y-6 sm:space-y-8">
                    {/* Shared Profiles */}
                    <div className="min-w-0">
                        <SharedProfilesList />
                    </div>
                </div>

                {/* Right column */}
                <div className="lg:col-span-4 space-y-6 sm:space-y-8 min-w-0">
                    <DoctorIdDisplay />
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
}

export default DoctorDashboard;
