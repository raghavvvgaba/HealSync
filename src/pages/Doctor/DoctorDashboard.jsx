import React from 'react';
import DoctorIdDisplay from '../../components/DoctorIdDisplay';
import SharedProfilesList from '../../components/SharedProfilesList';
import { useAuth } from '../../context/authContext';
import { FaUserMd, FaClock, FaBell } from 'react-icons/fa';


function DoctorDashboard() {
  const { user } = useAuth();

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
                                {getGreeting()}, <span className="text-blue-600 dark:text-blue-400">Dr. {user?.displayName || user?.email?.split('@')[0] || 'Doctor'}</span>
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 text-base">
                                Welcome to your practice dashboard. <span className="inline-block bg-blue-50 dark:bg-blue-950 px-2 py-1 rounded text-blue-700 dark:text-blue-300 ml-1">Here's your overview for today.</span>
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
                    {/* Shared Profiles Section */}
                    <SharedProfilesList />
                </div>

                {/* Right Column */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Doctor ID */}
                    <DoctorIdDisplay />

                    {/* Quick Stats */}
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-blue-200 dark:border-blue-700">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                            Practice Overview
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                <span className="text-sm text-blue-800 dark:text-blue-200">Total Shared Profiles</span>
                                <span className="text-lg font-bold text-blue-900 dark:text-blue-100">-</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                                <span className="text-sm text-green-800 dark:text-green-200">Active Shares</span>
                                <span className="text-lg font-bold text-green-900 dark:text-green-100">-</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                                <span className="text-sm text-purple-800 dark:text-purple-200">Recent Shares</span>
                                <span className="text-lg font-bold text-purple-900 dark:text-purple-100">-</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  );
}

export default DoctorDashboard;
