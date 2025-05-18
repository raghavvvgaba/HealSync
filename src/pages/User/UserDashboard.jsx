import React, { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import ProfileBlock from '../../components/ProfileBlock';
import MedicalRecordCard from '../../components/MedicalRecordCard';
import MedicalHistoryBlock from '../../components/MedicalHistoryBlock';
import { SharedWithBlock } from '../../components/SharedWithBlock';

const dummyUser = {
    firstName: 'Ravi',
    lastName: 'Kumar',
    height: 172,
    bloodGroup: 'B+',
    diseases: ['Diabetes', 'High BP', 'Wears Specs'],
};
const dummyRecords = [
    {
        visitDate: "2025-05-16",
        doctor: {
            name: "Dr. Priya Mehta",
            id: "D-4562"
        },
        symptoms: ["Headaches", "Nausea", "Vomiting"],
        diagnosis: "Migraine",
        medicines: ["Paracetamol 500mg", "Sumatriptan"],
        prescribedTests: ["MRI Brain", "Blood Test"],
        followUpNotes: "Follow-up in 2 weeks if symptoms persist.",
        fileName: "migraine-prescription.pdf",
        fileType: "pdf",
        fileUrl: "https://example.com/record.pdf"
    },
    {
        symptoms: ['Headaches', 'Nausea', 'Vomiting'],
        diagnosis: 'Migraine',
        medicines: ['Paracetamol 500mg', 'Sumatriptan'],
        fileName: 'migraine_report.pdf',
        fileType: 'pdf',
        fileUrl: '/files/migraine_report.pdf',
    },
    {
        symptoms: ['Headaches', 'Nausea', 'Vomiting'],
        diagnosis: 'Eye Checkup',
        medicines: ['Lubricant drops'],
        fileName: 'eye_checkup.jpeg',
        fileType: 'image',
        fileUrl: '/files/eye_checkup.jpeg',
    },
    {
        symptoms: ['Headaches', 'Nausea', 'Vomiting'],
        diagnosis: 'Eye Checkup',
        medicines: ['Lubricant drops'],
        fileName: 'eye_checkup.jpeg',
        fileType: 'image',
        fileUrl: '/files/eye_checkup.jpeg',
    },
    {
        symptoms: ['Headaches', 'Nausea', 'Vomiting'],
        diagnosis: 'Eye Checkup',
        medicines: ['Lubricant drops'],
        fileName: 'eye_checkup.jpeg',
        fileType: 'image',
        fileUrl: '/files/eye_checkup.jpeg',
    },
    {
        symptoms: ['Headaches', 'Nausea', 'Vomiting'],
        diagnosis: 'Migraine',
        medicines: ['Paracetamol 500mg', 'Sumatriptan'],
        fileName: 'migraine_report.pdf',
        fileType: 'pdf',
        fileUrl: '/files/migraine_report.pdf',
    },
    {
        symptoms: ['Headaches', 'Nausea', 'Vomiting'],
        diagnosis: 'Migraine',
        medicines: ['Paracetamol 500mg', 'Sumatriptan'],
        fileName: 'migraine_report.pdf',
        fileType: 'pdf',
        fileUrl: '/files/migraine_report.pdf',
    },
    {
        symptoms: ['Headaches', 'Nausea', 'Vomiting'],
        diagnosis: 'Migraine',
        medicines: ['Paracetamol 500mg', 'Sumatriptan'],
        fileName: 'migraine_report.pdf',
        fileType: 'pdf',
        fileUrl: '/files/migraine_report.pdf',
    },
];




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
                className={`bg-surface text-text transition-transform duration-300 ease-in-out
    ${isDesktop
                        ? 'fixed top-0 left-0 h-full w-64 z-40'
                        : sidebarOpen
                            ? 'fixed top-0 left-0 h-full w-64 z-40 pt-16 translate-x-0'
                            : 'fixed top-0 left-0 h-full w-64 z-40 pt-16 -translate-x-full'
                    }
  `}
            >

                <div className='p-6'>
                    <div className="flex items-center justify-between mb-6 text-text">
                        <h1 className="text-xl font-bold">HealSync</h1>
                    </div>
                    {!isDesktop && (
                        <button onClick={() => setSidebarOpen(false)}>
                            <FiX size={20} />
                        </button>
                    )}
                </div>
                <ul className="text-text space-y-4 pl-7">
                    <li>Overview</li>
                    <li>My Records</li>
                    <li>Doctors</li>
                    <li>Appointments</li>
                    <li>Settings</li>
                </ul>
            </div>


            {/* Main Content */}
            <div
                className={`flex-1 p-6 overflow-y-auto h-screen relative z-10 transition-all duration-300 ${isDesktop ? 'ml-64' : ''
                    }`}
            >
                {/* Mobile Sidebar Toggle Button */}
                {!sidebarOpen && !isDesktop && (
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="absolute top-4 left-4 z-50 bg-secondary text-white p-2 rounded-full shadow"
                    >
                        <FiMenu size={20} />
                    </button>
                )}

                {/* Page Heading */}
                <h2 className="text-2xl font-semibold mb-6">Welcome back, {dummyUser.firstName}</h2>

                {/* Dashboard Blocks */}
                <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-6">
                    <ProfileBlock user={dummyUser} />
                    <SharedWithBlock />
                    <MedicalHistoryBlock records={dummyRecords} />

                </div>


            </div>

        </div>
    );
};

export default UserDashboard;
