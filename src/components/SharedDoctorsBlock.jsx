import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { getPatientSharedProfiles, revokeProfileAccess } from '../utils/firestoreService';
import { FaUserMd, FaCalendarAlt, FaTrashAlt, FaSpinner, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';

const SharedDoctorsBlock = () => {
  const { user } = useAuth();
  const [sharedProfiles, setSharedProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revoking, setRevoking] = useState(null);
  const [notification, setNotification] = useState(null);
  const [confirmPopover, setConfirmPopover] = useState({ doctorId: null, doctorName: '' });

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
      <div className="flex items-center gap-3">
        <FaUserMd size={24} className="text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Shared with Doctors</h2>
        <span className="ml-auto bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
          {sharedProfiles.length} {sharedProfiles.length === 1 ? 'doctor' : 'doctors'}
        </span>
      </div>

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
