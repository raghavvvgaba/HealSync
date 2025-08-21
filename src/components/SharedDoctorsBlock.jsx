import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { getPatientSharedProfiles, revokeProfileAccess, shareProfileWithDoctor } from '../utils/firestoreService';
import { FaUserMd, FaCalendarAlt, FaTrashAlt, FaSpinner, FaExclamationTriangle, FaCheckCircle, FaPlus } from 'react-icons/fa';
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
        // Refresh the shared profiles list
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
      <div className="relative p-6 shadow-lg text-text border-2 border-surface flex flex-col gap-6 rounded-xl bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800 dark:via-gray-700 dark:to-blue-900">
        <div className="flex items-center gap-3">
          <FaUserMd size={24} className="text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Shared with Doctors</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="animate-spin text-blue-600 dark:text-blue-400 text-2xl" />
          <span className="ml-3 text-gray-600 dark:text-gray-300">Loading shared profiles...</span>
        </div>
      </div>
    );
  }

  return (
  <div className="relative p-6 shadow-lg text-text border-2 border-surface flex flex-col gap-6 rounded-xl bg-[#181F2A] dark:bg-[#181F2A] hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FaUserMd size={24} className="text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Shared with Doctors</h2>
          <span className="ml-2 flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs font-semibold min-w-[38px] h-6">
            {sharedProfiles.length} {sharedProfiles.length === 1 ? 'doctor' : 'doctors'}
          </span>
        </div>
        <button
          onClick={() => setShowShareForm(!showShareForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <FaPlus />
          Share with Doctor
        </button>
      </div>

      {/* Share Form */}
      <AnimatePresence>
        {showShareForm && (
          <motion.form
            onSubmit={handleSubmit(handleShare)}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800 space-y-3"
          >
            <label className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              Doctor's ID
            </label>
            <div className="space-y-1">
              <input
                type="text"
                placeholder="e.g., DR-HALE-1234"
                {...register("doctorId", { 
                  required: "Doctor ID is required",
                  pattern: {
                    value: /^DR-[BCDFGHJKLMNPQRSTVWXYZAEIOU]{4}-\d{4}$/i,
                    message: "Invalid doctor ID format (DR-XXXX-1234)"
                  }
                })}
                className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm uppercase focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength={12}
              />
              {errors.doctorId && (
                <p className="text-red-500 text-xs">{errors.doctorId.message}</p>
              )}
              <p className="text-gray-500 text-xs">
                Format: DR-XXXX-1234
              </p>
            </div>
            
            {shareStatus === 'error' && (
              <div className="text-red-500 text-xs bg-red-50 dark:bg-red-900/30 p-2 rounded">
                {shareErrorMessage || 'An error occurred. Please try again.'}
              </div>
            )}
            
            {shareStatus === 'success' && (
              <div className="text-green-600 dark:text-green-400 text-xs bg-green-50 dark:bg-green-900/30 p-2 rounded">
                Profile shared successfully{doctorName ? ` with Dr. ${doctorName}!` : '!'}
              </div>
            )}
            
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSharing}
                className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {isSharing ? "Sharing..." : "Share Profile"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowShareForm(false);
                  setShareStatus(null);
                  setShareErrorMessage('');
                  reset();
                }}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Notification */}
      {notification && (
        <div className={`p-4 rounded-lg border-l-4 ${
          notification.type === 'success' 
            ? 'bg-green-50 border-green-400 text-green-700 dark:bg-green-900 dark:text-green-300' 
            : 'bg-red-50 border-red-400 text-red-700 dark:bg-red-900 dark:text-red-300'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <FaCheckCircle className="mr-2" />
            ) : (
              <FaExclamationTriangle className="mr-2" />
            )}
            {notification.message}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <FaExclamationTriangle className="text-red-500 text-3xl mb-3 mx-auto" />
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={fetchSharedProfiles}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* No Shared Profiles */}
      {!error && sharedProfiles.length === 0 && (
        <div className="text-center py-8">
          <FaUserMd className="text-gray-400 text-4xl mb-4 mx-auto" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">No doctors have access to your profile yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">Share your profile with doctors to see them here</p>
        </div>
      )}

      {/* Shared Profiles List */}
      {!error && sharedProfiles.length > 0 && (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {sharedProfiles.map((profile) => (
            <div 
              key={profile.id} 
              className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FaUserMd className="text-blue-600 dark:text-blue-400" />
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                        {profile.doctorName || 'Unknown Doctor'}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ID: {profile.doctorIdCode}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <FaCalendarAlt className="text-gray-400" />
                    <span>
                      Shared on {profile.sharedAt?.toDate ? 
                        profile.sharedAt.toDate().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 
                        'Unknown date'
                      }
                    </span>
                  </div>
                </div>

                {confirmPopover.doctorId === profile.doctorId ? (
                  <div className="ml-4 flex flex-col items-end gap-2">
                    <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg border border-red-300 dark:border-red-700 shadow-lg">
                      <p className="text-sm text-red-700 dark:text-red-300 mb-2">Are you sure you want to revoke <span className="font-bold">{profile.doctorName}</span>'s access?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={confirmRevoke}
                          className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold text-sm"
                          disabled={revoking === profile.doctorId}
                        >
                          {revoking === profile.doctorId ? 'Revoking...' : 'Confirm'}
                        </button>
                        <button
                          onClick={() => setConfirmPopover({ doctorId: null, doctorName: '' })}
                          className="px-3 py-1 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm"
                          disabled={revoking === profile.doctorId}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRevokeAccess(profile.doctorId, profile.doctorName)}
                    disabled={revoking === profile.doctorId}
                    className="ml-4 flex items-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-300 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {revoking === profile.doctorId ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <MdCancel />
                    )}
                    {revoking === profile.doctorId ? 'Revoking...' : 'Revoke Access'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {sharedProfiles.length > 0 && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Revoked access cannot be restored. The doctor will need a new invitation to access your profile again.
          </p>
        </div>
      )}
    </div>
  );
};

export default SharedDoctorsBlock;
