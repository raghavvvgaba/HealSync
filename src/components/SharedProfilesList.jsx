import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { getSharedProfiles } from '../utils/firestoreDoctorService';
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
            <div className="glass-elevated rounded-3xl p-8">
                <div className="flex items-center justify-center py-8">
                    <FaSpinner className="animate-spin text-2xl text-primary mr-2" />
                    <span className="text-secondary">Loading shared profiles...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-elevated rounded-3xl p-8">
                <h3 className="text-lg font-semibold text-text mb-2">Error Loading Profiles</h3>
                <p className="text-secondary text-sm">{error}</p>
            </div>
        );
    }

    if (sharedProfiles.length === 0) {
        return (
            <div className="glass-elevated rounded-3xl overflow-hidden">
                <div className="p-6 border-b soft-divider bg-gradient-to-r from-primary/15 to-accent/15">
                    <h2 className="text-xl font-bold text-text">Shared Patient Records</h2>
                </div>
                <div className="text-center py-12 px-6">
                    <FaUser className="text-4xl mx-auto mb-4 text-primary/70" />
                    <p className="text-lg text-text mb-2">No patient records shared yet.</p>
                    <p className="text-sm text-secondary">Share your Doctor ID with patients to receive their medical records.</p>
                </div>
            </div>
        );
    }

    return (
    <div className="glass-elevated rounded-3xl overflow-hidden hover-glow-primary">
            <div className="p-6 border-b soft-divider bg-gradient-to-r from-primary/15 to-accent/15">
                <h2 className="text-xl font-bold text-text">Shared Patient Records ({sharedProfiles.length})</h2>
            </div>
            <div className="p-6">
                <div className="space-y-4">
                    {sharedProfiles.map((profile) => (
                        <div key={profile.id} className="glass rounded-2xl p-5 border soft-divider transition-all lift-on-hover hover-glow-primary">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-lg bg-[rgba(var(--primary-rgb)/0.15)] text-primary flex items-center justify-center">
                                            <FaUser />
                                        </div>
                                        <h3 className="font-semibold text-text">{profile.patientName}</h3>
                                    </div>
                                    <p className="text-sm text-secondary mb-1">{profile.patientEmail}</p>
                                    <div className="flex items-center gap-2 text-xs text-secondary">
                                        <FaCalendar />
                                        <span>Shared on {formatDate(profile.sharedAt)}</span>
                                    </div>
                                </div>
                                <button onClick={() => viewProfile(profile.id)} className="glass-cta flex items-center gap-2 px-5 py-2.5">
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
