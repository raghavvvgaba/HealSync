import React, { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import MedicalRecordCard from '../components/MedicalRecordCard';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/authContext';
import { getPatientMedicalRecords } from '../utils/firestoreService';
import { FaFileMedicalAlt, FaRedo, FaExclamationTriangle } from 'react-icons/fa';

const MedicalHistoryPage = ({ direction = 1 }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State for medical records
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch medical records when component mounts
  useEffect(() => {
    if (user?.uid) {
      fetchMedicalRecords(true); // true = initial load
    }
  }, [user]);

  const fetchMedicalRecords = async (isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
        setError(null);
        setMedicalRecords([]);
        setLastDoc(null);
      } else {
        setLoadingMore(true);
      }
      
      const result = await getPatientMedicalRecords(
        user.uid,
        isInitial ? null : lastDoc, // lastDoc for pagination
        20,       // pageSize
        false     // includeDeactivated - only active records
      );
      
      if (result.success) {
        const newRecords = result.data || [];
        
        if (isInitial) {
          setMedicalRecords(newRecords);
        } else {
          setMedicalRecords(prev => [...prev, ...newRecords]);
        }
        
        setLastDoc(result.lastDoc);
        setHasMore(result.hasMore);
      } else {
        setError(result.error || 'Failed to fetch medical records');
        if (isInitial) {
          setMedicalRecords([]);
        }
      }
    } catch (error) {
      console.error('Error fetching medical records:', error);
      setError('Failed to load medical records');
      if (isInitial) {
        setMedicalRecords([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchMedicalRecords(false);
    }
  };

  const handleRefresh = () => {
    fetchMedicalRecords(true);
  };
  return (
    <motion.div
      className="min-h-screen bg-background text-text px-4 py-6 sm:px-6"
      initial={{ x: direction > 0 ? '100%' : '-100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: direction > 0 ? '-100%' : '100%', opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="sticky top-0 z-10 bg-background pb-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-primary hover:text-accent mb-6"
          >
            <FiArrowLeft size={20} />
            <span className="text-base font-medium">Back</span>
          </button>
          
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200 disabled:opacity-50 mb-6"
            title="Refresh records"
          >
            <FaRedo className={`text-sm ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm">Refresh</span>
          </button>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-6">Your Complete Medical History</h1>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your medical records...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-12">
          <FaExclamationTriangle className="text-red-400 text-5xl mb-4 mx-auto" />
          <p className="text-red-600 dark:text-red-400 mb-2 text-lg">Failed to load medical records</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Medical Records */}
      {!loading && !error && (
        <>
          {medicalRecords.length > 0 ? (
            <div className="flex flex-col gap-6">
              {medicalRecords.map((record) => (
                <MedicalRecordCard 
                  key={record.id} 
                  record={record} 
                />
              ))}
              
              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingMore ? (
                      <>
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Loading more...
                      </>
                    ) : (
                      'Load More Records'
                    )}
                  </button>
                </div>
              )}
              
              {/* Records Count */}
              <div className="text-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {medicalRecords.length} medical records
                  {!hasMore && medicalRecords.length > 0 && ' (all records loaded)'}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <FaFileMedicalAlt className="text-gray-400 text-6xl mb-6 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No Medical Records Found
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mb-6">
                Your medical history will appear here once doctors add records to your profile.
              </p>
              <button
                onClick={handleRefresh}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors duration-200"
              >
                Check for New Records
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default MedicalHistoryPage;
