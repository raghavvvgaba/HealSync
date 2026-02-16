import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { getPatientSharedProfiles, revokeProfileAccess, shareProfileWithDoctor } from '../utils/firestoreService';
import { FaUserMd, FaCalendarAlt, FaSpinner, FaExclamationTriangle, FaCheckCircle, FaPlus, FaChevronRight } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

const SharedDoctorsBlock = () => {
  const { user } = useAuth();
  const [sharedProfiles, setSharedProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revoking, setRevoking] = useState(null);
  const [notification, setNotification] = useState(null);
  const [confirmPopover, setConfirmPopover] = useState({ doctorId: null, doctorName: '' });
  const [showShareForm, setShowShareForm] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareStatus, setShareStatus] = useState(null);
  const [shareErrorMessage, setShareErrorMessage] = useState('');
  const [doctorName, setDoctorName] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (user?.uid) {
      fetchSharedProfiles();
    }
  }, [user]);

  const fetchSharedProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getPatientSharedProfiles(user.uid);
      
      if (result.success) {
        setSharedProfiles(result.data);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to fetch shared profiles');
      console.error('Error fetching shared profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeAccess = (doctorId, doctorName) => {
    setConfirmPopover({ doctorId, doctorName });
  };

  const confirmRevoke = async () => {
    const { doctorId, doctorName } = confirmPopover;
    setRevoking(doctorId);
    setConfirmPopover({ doctorId: null, doctorName: '' });
    try {
      const result = await revokeProfileAccess(user.uid, doctorId);
      if (result.success) {
        setSharedProfiles(prev => prev.filter(profile => profile.doctorId !== doctorId));
        setNotification({
          type: 'success',
          message: `Successfully revoked ${doctorName}'s access to your profile.`
        });
      } else {
        setNotification({
          type: 'error',
          message: result.error || 'Failed to revoke access'
        });
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'An unexpected error occurred'
      });
      console.error('Error revoking access:', error);
    } finally {
      setRevoking(null);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleShare = async (data) => {
    if (!user) {
      setShareErrorMessage('You must be logged in to share your profile');
      setShareStatus('error');
      return;
    }

    setIsSharing(true);
    setShareStatus(null);
    setShareErrorMessage('');
    
    try {
      const doctorIdCode = data.doctorId.toUpperCase();
      
      const shareResult = await shareProfileWithDoctor(
        user.uid, 
        doctorIdCode
      );
      
      if (shareResult.success) {
        setDoctorName(shareResult.doctorName || '');
        setShareStatus('success');
        await fetchSharedProfiles();
        setTimeout(() => {
          reset();
          setShowShareForm(false);
          setShareStatus(null);
          setShareErrorMessage('');
          setDoctorName('');
        }, 2000);
      } else {
        setShareErrorMessage(shareResult.error || 'Failed to share profile');
        setShareStatus('error');
      }
      
    } catch (error) {
      console.error("Error sharing profile:", error);
      setShareErrorMessage('An unexpected error occurred. Please try again.');
      setShareStatus('error');
    }
    
    setIsSharing(false);
  };

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6 border soft-divider flex flex-col items-center justify-center py-12">
        <FaSpinner className="animate-spin text-primary text-3xl mb-3" />
        <span className="text-secondary text-sm">Loading shared profiles...</span>
      </div>
    );
  }

  return (
  <div className="glass rounded-2xl p-6 border soft-divider flex flex-col gap-6 hover-glow-primary xl:max-w-5xl xl:mx-auto">
      {/* Header */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl glass-cta text-white flex items-center justify-center shadow-lg">
          <FaUserMd className="text-lg" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-text leading-tight">Shared with Doctors</h2>
          <p className="text-xs text-secondary">{sharedProfiles.length} active {sharedProfiles.length === 1 ? 'share' : 'shares'}</p>
        </div>
      </div>
      <button
        onClick={() => setShowShareForm(!showShareForm)}
        className="glass p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors border soft-divider"
        title="Share with new doctor"
      >
        <FaPlus />
      </button>
    </div>

      {/* Share Form */}
      <AnimatePresence>
        {showShareForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleSubmit(handleShare)}
              className="p-4 bg-surface/50 rounded-xl border soft-divider space-y-3 mb-4"
            >
              <h3 className="text-sm font-bold text-text">Share Profile</h3>
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Enter Doctor ID (e.g., DR-HALE-1234)"
                  {...register("doctorId", { 
                    required: "Doctor ID is required",
                    pattern: {
                      value: /^DR-[BCDFGHJKLMNPQRSTVWXYZAEIOU]{4}-\d{4}$/i,
                      message: "Invalid doctor ID format"
                    }
                  })}
                  className="w-full px-3 py-2.5 rounded-lg glass border soft-divider text-text placeholder:text-secondary/60 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-primary/40"
                  maxLength={12}
                />
                {errors.doctorId && (
                  <p className="text-red-500 text-xs mt-1">{errors.doctorId.message}</p>
                )}
              </div>
              
              {shareStatus === 'error' && (
                <div className="text-red-500 text-xs bg-red-500/10 p-2 rounded border border-red-500/20">
                  {shareErrorMessage || 'An error occurred.'}
                </div>
              )}
              
              {shareStatus === 'success' && (
                <div className="text-green-500 text-xs bg-green-500/10 p-2 rounded border border-green-500/20">
                  Shared successfully{doctorName ? ` with Dr. ${doctorName}` : ''}!
                </div>
              )}
              
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isSharing}
                  className="flex-1 glass-cta px-3 py-2 text-sm font-semibold rounded-lg disabled:opacity-50"
                >
                  {isSharing ? "Sharing..." : "Share Access"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowShareForm(false);
                    setShareStatus(null);
                    setShareErrorMessage('');
                    reset();
                  }}
                  className="px-3 py-2 text-sm font-medium text-secondary hover:text-text transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification */}
      {notification && (
        <div className={`p-3 rounded-lg text-xs font-medium border flex items-center gap-2 ${
          notification.type === 'success' 
            ? 'bg-green-500/10 text-green-600 border-green-500/20' 
            : 'bg-red-500/10 text-red-600 border-red-500/20'
        }`}>
          {notification.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
          {notification.message}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-6 bg-red-500/5 rounded-xl border border-red-500/10">
          <p className="text-red-500 text-sm mb-2">{error}</p>
          <button 
            onClick={fetchSharedProfiles}
            className="text-xs font-bold text-red-600 hover:underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* No Shared Profiles */}
    {!error && sharedProfiles.length === 0 && !showShareForm && (
        <div className="text-center py-10 px-4">
          <div className="w-12 h-12 bg-surface/50 rounded-full flex items-center justify-center mx-auto mb-3">
            <FaUserMd className="text-secondary/50 text-xl" />
          </div>
          <p className="text-text font-medium text-sm mb-1">No doctors linked</p>
          <p className="text-xs text-secondary mb-4">Share your profile to give doctors access</p>
          <button
            onClick={() => setShowShareForm(true)}
            className="text-primary text-xs font-bold hover:underline"
          >
            Share Profile Now
          </button>
        </div>
      )}

      {/* Shared Profiles List */}
  {!error && sharedProfiles.length > 0 && (
    <div className="flex flex-col gap-2">
          {sharedProfiles.map((profile) => (
            <div 
              key={profile.id} 
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl hover:bg-surface/50 transition-colors border border-transparent hover:border-primary/10"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                  <span className="font-bold text-sm">
                    {profile.doctorName ? profile.doctorName.charAt(0).toUpperCase() : 'D'}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-text text-sm truncate">
                    {profile.doctorName || 'Unknown Doctor'}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-secondary">
                    <span className="font-mono bg-surface/50 px-1 rounded border soft-divider">{profile.doctorIdCode}</span>
                    <span className="flex items-center gap-1"><FaCalendarAlt className="text-[8px]" /> {profile.sharedAt?.toDate ? profile.sharedAt.toDate().toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>

              {confirmPopover.doctorId === profile.doctorId ? (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 bg-red-500/5 p-1 rounded-lg border border-red-500/10">
                  <span className="text-[10px] font-bold text-red-500 ml-1 hidden sm:inline">Revoke?</span>
                  <button
                    onClick={confirmRevoke}
                    className="px-2 py-1 rounded bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors"
                    disabled={revoking === profile.doctorId}
                  >
                    {revoking === profile.doctorId ? <FaSpinner className="animate-spin" /> : 'Yes'}
                  </button>
                  <button
                    onClick={() => setConfirmPopover({ doctorId: null, doctorName: '' })}
                    className="px-2 py-1 rounded text-secondary text-xs hover:bg-black/5 dark:hover:bg-white/10"
                    disabled={revoking === profile.doctorId}
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleRevokeAccess(profile.doctorId, profile.doctorName)}
                  className="p-2 text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all self-end sm:self-auto"
                  title="Revoke Access"
                >
                  <MdCancel />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {sharedProfiles.length > 0 && (
        <div className="pt-2 border-t soft-divider text-center">
          <p className="text-[10px] text-secondary">
            Revoking access prevents the doctor from viewing your records immediately.
          </p>
        </div>
      )}
    </div>
  );
};

export default SharedDoctorsBlock;
