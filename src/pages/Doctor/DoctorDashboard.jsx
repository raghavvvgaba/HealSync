import React from 'react';
import DoctorIdDisplay from '../../components/DoctorIdDisplay';
import SharedProfilesList from '../../components/SharedProfilesList';
import { useAuth } from '../../context/authContext';
import { FaClock, FaBell, FaUsers, FaHeartbeat, FaStethoscope, FaChartLine } from 'react-icons/fa';

function DoctorDashboard() {
    const { user } = useAuth();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div className="min-h-screen bg-background aurora-bg">
            {/* Header - gradient ribbon */}
            <div className="relative bg-gradient-to-br from-primary/25 via-accent/20 to-transparent px-6 pt-8 pb-6 border-b soft-divider">
                <div className="flex items-center justify-between">
                    <div className="flex items-start gap-5">
                        <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center shadow-lg">
                            <FaStethoscope className="text-primary text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-text">
                                {getGreeting()}, <span className="text-primary">Dr. {user?.displayName || user?.email?.split('@')[0] || 'Doctor'}</span>
                            </h1>
                            <div className="mt-3 inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-secondary">
                                <FaHeartbeat className="text-accent" />
                                Manage patient care with precision
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="glass rounded-2xl px-5 py-3 flex items-center gap-3 shadow-lg">
                            <FaClock className="text-primary" />
                            <div>
                                <div className="text-xs text-secondary">Today</div>
                                <div className="text-sm font-semibold text-text">
                                    {new Date().toLocaleDateString('en-US', {
                                        weekday: 'long', month: 'short', day: 'numeric'
                                    })}
                                </div>
                            </div>
                        </div>
                        <button className="relative rounded-2xl px-4 py-3 text-white shadow-xl bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 transition-all">
                            <FaBell className="text-lg" />
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-accent shadow"></span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left column */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Quick Actions */}
                    <div className="glass-elevated rounded-3xl p-6 hover-glow-primary">
                        <h3 className="text-xl font-bold text-text mb-6 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center">
                                <FaChartLine className="text-sm" />
                            </div>
                            Quick Actions
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <button className="group glass rounded-2xl p-6 lift-on-hover hover-glow-primary transition-all border soft-divider">
                                <FaUsers className="text-primary text-2xl mb-2" />
                                <div className="text-left">
                                    <div className="font-semibold text-text">View All Patients</div>
                                    <div className="text-secondary text-sm mt-1">Manage patient records</div>
                                </div>
                            </button>
                              <button className="group rounded-2xl p-6 lift-on-hover hover-glow-accent transition-all border soft-divider bg-gradient-to-br from-accent/25 to-accent/10">
                                <FaHeartbeat className="text-accent text-2xl mb-2" />
                                <div className="text-left">
                                    <div className="font-semibold text-text">Schedule Appointment</div>
                                    <div className="text-secondary text-sm mt-1">Book new consultations</div>
                                </div>
                            </button>
                              <button className="group glass rounded-2xl p-6 lift-on-hover hover-glow-primary transition-all border soft-divider">
                                <FaStethoscope className="text-secondary text-2xl mb-2" />
                                <div className="text-left">
                                    <div className="font-semibold text-text">Medical Reports</div>
                                    <div className="text-secondary text-sm mt-1">Generate & view reports</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Shared Profiles */}
                    <SharedProfilesList />
                </div>

                {/* Right column */}
                <div className="lg:col-span-4 space-y-8">
                    <DoctorIdDisplay />
                </div>
            </div>
        </div>
    );
}

export default DoctorDashboard;
