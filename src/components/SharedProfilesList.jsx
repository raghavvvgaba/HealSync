import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { getSharedProfiles } from '../utils/firestoreDoctorService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FaUser, FaCalendar, FaEye, FaSpinner, FaEnvelope, FaTint, FaVenusMars, FaIdCard } from 'react-icons/fa';

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
                // Fetch patient names and profile data for each shared profile
                const profilesWithDetails = await Promise.all(
                    result.data.map(async (share) => {
                        try {
                            // Fetch user basic data
                            const userDocRef = doc(db, "users", share.patientId);
                            const userDoc = await getDoc(userDocRef);
                            const userData = userDoc.exists() ? userDoc.data() : {};
                            
                            // Fetch profile data
                            const profileDocRef = doc(db, "userProfile", share.patientId);
                            const profileDoc = await getDoc(profileDocRef);
                            const profileData = profileDoc.exists() ? profileDoc.data() : {};
                            
                            return {
                                ...share,
                                patientName: profileData.basic?.fullName || userData.name || 'Unknown Patient',
                                patientEmail: userData.email || '',
                                gender: profileData.basic?.gender || 'N/A',
                                bloodGroup: profileData.basic?.bloodGroup || 'N/A'
                            };
                        } catch (error) {
                            console.error(`Error fetching patient data for ${share.patientId}:`, error);
                            return {
                                ...share,
                                patientName: 'Unknown Patient',
                                patientEmail: '',
                                gender: 'N/A',
                                bloodGroup: 'N/A'
                            };
                        }
                    })
                );
                
                setSharedProfiles(profilesWithDetails);
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
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch (error) {
            return 'Unknown';
        }
    };

    if (loading) {
        return (
            <div className="glass-elevated rounded-3xl p-12">
                <div className="flex flex-col items-center justify-center py-8">
                    <FaSpinner className="animate-spin text-4xl text-primary mb-4" />
                    <span className="text-secondary font-medium">Synchronizing patient records...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-elevated rounded-3xl p-8 border-red-500/20">
                <div className="flex items-center gap-3 text-red-500 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                        <FaUser />
                    </div>
                    <h3 className="text-lg font-bold">Error Loading Profiles</h3>
                </div>
                <p className="text-secondary text-sm bg-red-500/5 p-4 rounded-xl border border-red-500/10">{error}</p>
            </div>
        );
    }

    if (sharedProfiles.length === 0) {
        return (
            <div className="glass-elevated rounded-3xl overflow-hidden">
                <div className="p-6 border-b soft-divider glass">
                    <h2 className="text-xl font-bold text-text">Shared Patient Records</h2>
                </div>
                <div className="text-center py-16 px-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaUser className="text-4xl text-primary/70" />
                    </div>
                    <p className="text-xl font-bold text-text mb-2">No patient records shared yet.</p>
                    <p className="text-secondary max-w-sm mx-auto">Share your unique Doctor ID with patients to start receiving access to their medical profiles.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-elevated rounded-3xl overflow-hidden">
            <div className="p-6 sm:p-8 border-b soft-divider glass flex items-center justify-between">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-text">Patient Directory</h2>
                    <p className="text-sm text-secondary mt-1">Manage and view records from {sharedProfiles.length} shared {sharedProfiles.length === 1 ? 'profile' : 'profiles'}.</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
                    <FaIdCard /> {sharedProfiles.length} TOTAL
                </div>
            </div>
            <div className="p-4 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {sharedProfiles.map((profile) => (
                        <div 
                            key={profile.id} 
                            className="glass rounded-2xl p-5 sm:p-6 border soft-divider transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 group flex flex-col"
                        >
                            <div className="flex items-start justify-between gap-4 mb-6">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl glass-cta text-white flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                                        <FaUser className="text-xl sm:text-2xl" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-lg font-bold text-text truncate group-hover:text-primary transition-colors">
                                            {profile.patientName}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs text-secondary mt-1 truncate">
                                            <FaEnvelope className="shrink-0" />
                                            {profile.patientEmail}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                        profile.gender?.toLowerCase() === 'male' ? 'bg-blue-500/10 text-blue-600' :
                                        profile.gender?.toLowerCase() === 'female' ? 'bg-pink-500/10 text-pink-600' :
                                        'bg-surface/50 text-secondary'
                                    }`}>
                                        {profile.gender}
                                    </span>
                                    {profile.bloodGroup && profile.bloodGroup !== 'N/A' && (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 flex items-center gap-1 uppercase tracking-wider">
                                            <FaTint className="text-[8px]" /> {profile.bloodGroup}
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="p-3 bg-surface/50 rounded-xl border soft-divider">
                                    <div className="flex items-center gap-2 mb-1">
                                        <FaCalendar className="text-primary text-[10px]" />
                                        <span className="text-[10px] uppercase font-bold text-secondary tracking-wider">Access Granted</span>
                                    </div>
                                    <span className="text-xs font-semibold text-text">{formatDate(profile.sharedAt)}</span>
                                </div>
                                <div className="p-3 bg-surface/50 rounded-xl border soft-divider">
                                    <div className="flex items-center gap-2 mb-1">
                                        <FaIdCard className="text-primary text-[10px]" />
                                        <span className="text-[10px] uppercase font-bold text-secondary tracking-wider">Patient ID</span>
                                    </div>
                                    <span className="text-xs font-mono font-semibold text-text">
                                        {profile.patientId?.substring(0, 8).toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <button 
                                onClick={() => viewProfile(profile.id)} 
                                className="glass-cta flex items-center justify-center gap-2 w-full py-3 mt-auto group-hover:shadow-lg transition-all"
                            >
                                <FaEye className="text-sm" />
                                <span className="font-bold">Access Medical Records</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SharedProfilesList;

