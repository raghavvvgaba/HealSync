import React, { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

const UserDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

    useEffect(() => {
        const handleResize = () => {
            const isNowDesktop = window.innerWidth >= 768;
            setIsDesktop(isNowDesktop);
            setSidebarOpen(isNowDesktop); // force open on desktop, hide on mobile
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="relative flex h-screen bg-background text-text overflow-hidden">
            {/* Sidebar Backdrop (only on mobile) */}
            {!isDesktop && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`bg-surface border-r border-gray-200 dark:border-none p-4 h-full transition-transform duration-300 ease-in-out md:static md:block md:w-64 ${isDesktop
                    ? 'w-64'
                    : sidebarOpen
                        ? 'fixed top-0 left-0 w-64 z-40 pt-20 translate-x-0'
                        : 'fixed top-0 left-0 w-64 z-40 pt-20 -translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between mb-6 text-text">
                    <h1 className="text-xl font-bold">HealSync</h1>
                    {!isDesktop && (
                        <button onClick={() => setSidebarOpen(false)}>
                            <FiX size={20} />
                        </button>
                    )}
                </div>
                <ul className="text-text space-y-4">
                    <li>Overview</li>
                    <li>My Records</li>
                    <li>Doctors</li>
                    <li>Appointments</li>
                    <li>Settings</li>
                </ul>
            </div>


            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto relative z-10">
                {/* Toggle Button (Mobile only) */}
                {!sidebarOpen && !isDesktop && (
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="absolute top-4 left-4 z-50 bg-secondary text-white p-2 rounded-full shadow"
                    >
                        <FiMenu size={20} />
                    </button>
                )}

                <h2 className="text-2xl font-semibold mb-6">Welcome back 👋</h2>

                {/* Dashboard Blocks */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <div className="bg-surface rounded-2xl h-40 p-4 shadow text-text">
                        Quick Action
                    </div>
                    <div className="bg-surface rounded-2xl h-40 p-4 shadow text-text">
                        Upcoming Appointments
                    </div>
                    <div className="bg-surface rounded-2xl h-40 p-4 shadow text-text">
                        Shared With
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-surface rounded-2xl h-60 p-4 shadow text-text col-span-2">
                        Recent Records
                    </div>
                </div>

            </div>
        </div>
    );
};

export default UserDashboard;
