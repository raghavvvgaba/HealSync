import React, { useState, useEffect, useLayoutEffect } from 'react';
import { FiArrowLeft, FiCalendar, FiUser, FiActivity } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { getPatientMedicalRecords } from '../utils/firestoreService';
import { FaFileMedicalAlt, FaRedo, FaExclamationTriangle, FaSpinner, FaDownload, FaEye, FaChevronRight, FaStethoscope, FaPills, FaFlask, FaNotesMedical } from 'react-icons/fa';

const MedicalHistoryPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (user?.uid) {
      fetchMedicalRecords(true);
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
        isInitial ? null : lastDoc,
        20,
        false
      );

      if (result.success) {
        const newRecords = result.data || [];
        if (isInitial) {
          setMedicalRecords(newRecords);
        } else {
          setMedicalRecords((prev) => [...prev, ...newRecords]);
        }
        setLastDoc(result.lastDoc || null);
        setHasMore(Boolean(result.hasMore));
      } else {
        setError(result.error || 'Failed to fetch medical records');
      }
    } catch (err) {
      console.error('Error fetching medical records:', err);
      setError('Failed to load medical records');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) fetchMedicalRecords(false);
  };

  const handleRefresh = () => {
    fetchMedicalRecords(true);
  };

  const TagList = ({ items, icon: Icon, label, colorClass }) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-secondary">
          <Icon className="text-xs" />
          <span className="text-[10px] uppercase font-bold tracking-wider">{label}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, idx) => (
            <span key={idx} className={`px-2.5 py-1 rounded-lg text-xs font-medium border soft-divider glass ${colorClass}`}>
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const RecordCard = ({ record, isLast }) => {
    const date = record.visitDate ? new Date(record.visitDate) : new Date();
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = date.getDate();
    const year = date.getFullYear();

    return (
      <div className="relative pl-8 sm:pl-12 pb-10 group">
        {/* Timeline Line */}
        {!isLast && (
          <div className="absolute left-[11px] sm:left-[15px] top-8 bottom-0 w-0.5 bg-dashed border-l border-primary/20" />
        )}
        
        {/* Timeline Marker */}
        <div className="absolute left-0 top-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full glass border-2 border-primary flex items-center justify-center z-10 shadow-lg group-hover:scale-110 transition-transform bg-background">
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary animate-pulse" />
        </div>

        {/* Date Label (Floating side) */}
        <div className="absolute -left-20 top-0 hidden xl:flex flex-col items-end w-16">
          <span className="text-xs font-bold text-secondary uppercase">{month}</span>
          <span className="text-2xl font-bold text-text leading-none">{day}</span>
          <span className="text-[10px] text-secondary/60 mt-1">{year}</span>
        </div>

        {/* Card Content */}
        <div className="glass-elevated rounded-2xl border soft-divider p-5 sm:p-6 hover-glow-primary transition-all">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="xl:hidden px-2 py-0.5 rounded-md glass border soft-divider text-[10px] font-bold text-primary">
                  {day} {month} {year}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-text truncate">{record.diagnosis || 'General Checkup'}</h3>
              </div>
              <div className="flex items-center gap-3 text-sm text-secondary">
                <div className="flex items-center gap-1.5">
                  <FiUser className="text-primary" />
                  <span>{record.doctorName || record.doctor?.name || 'Unknown Doctor'}</span>
                </div>
                {record.visitDate && (
                  <div className="flex items-center gap-1.5 border-l border-secondary/30 pl-3">
                    <FiCalendar className="text-primary" />
                    <span>{new Date(record.visitDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            {record.fileUrl && (
              <div className="flex gap-2 shrink-0">
                <a 
                  href={record.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2.5 rounded-xl glass border soft-divider text-primary hover:bg-primary/10 transition-colors shadow-sm"
                  title="View Document"
                >
                  <FaEye size={16} />
                </a>
                <a 
                  href={record.fileUrl} 
                  download 
                  className="p-2.5 rounded-xl glass border soft-divider text-primary hover:bg-primary/10 transition-colors shadow-sm"
                  title="Download"
                >
                  <FaDownload size={16} />
                </a>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TagList 
              items={record.symptoms} 
              icon={FaExclamationTriangle} 
              label="Symptoms" 
              colorClass="text-red-500 bg-red-500/5 border-red-500/10" 
            />
            <TagList 
              items={record.medicines} 
              icon={FaPills} 
              label="Medications" 
              colorClass="text-green-500 bg-green-500/5 border-green-500/10" 
            />
            <TagList 
              items={record.prescribedTests} 
              icon={FaFlask} 
              label="Prescribed Tests" 
              colorClass="text-amber-500 bg-amber-500/5 border-amber-500/10" 
            />
            
            {record.followUpNotes && (
              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center gap-2 text-secondary">
                  <FaNotesMedical className="text-xs" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Follow-up Notes</span>
                </div>
                <div className="p-4 bg-surface/30 rounded-xl border border-dashed soft-divider">
                  <p className="text-sm text-text leading-relaxed italic">"{record.followUpNotes}"</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background aurora-bg aurora-subtle px-4 sm:px-8 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm font-semibold text-secondary hover:text-primary hover-glow-primary transition-all mb-4"
            >
              <FiArrowLeft size={18} /> Back to Dashboard
            </button>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight">Medical History</h1>
            <p className="text-secondary mt-2 font-medium">Chronological record of your health journey</p>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="self-start md:self-auto glass-cta px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            <FaRedo className={loading ? 'animate-spin' : ''} />
            {loading ? 'Refreshing...' : 'Refresh Records'}
          </button>
        </div>

        {/* Content States */}
        {loading && medicalRecords.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <FaSpinner className="animate-spin text-4xl text-primary" />
            <p className="text-secondary font-medium tracking-wide">Loading your medical journey...</p>
          </div>
        ) : error && medicalRecords.length === 0 ? (
          <div className="py-16 text-center glass-elevated rounded-3xl border border-red-500/20 p-8">
            <FaExclamationTriangle className="text-red-500 text-5xl mb-4 mx-auto" />
            <h3 className="text-xl font-bold text-text mb-2">Oops! Something went wrong</h3>
            <p className="text-secondary mb-6">{error}</p>
            <button onClick={handleRefresh} className="glass-cta px-8 py-3 rounded-xl">Try Again</button>
          </div>
        ) : medicalRecords.length > 0 ? (
          <div className="xl:ml-20"> {/* Offset for XL floating dates */}
            <div className="flex flex-col">
              {medicalRecords.map((record, index) => (
                <RecordCard 
                  key={record.id} 
                  record={record} 
                  isLast={index === medicalRecords.length - 1} 
                />
              ))}
            </div>

            {hasMore && (
              <div className="mt-4 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 glass rounded-xl border soft-divider text-text font-bold hover-glow-primary transition-all disabled:opacity-50"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <FaSpinner className="animate-spin" /> Loading more...
                    </span>
                  ) : (
                    'Load Older Records'
                  )}
                </button>
              </div>
            )}
            
            <div className="mt-12 py-6 border-t soft-divider text-center">
              <p className="text-xs font-bold text-secondary uppercase tracking-widest">
                End of history • {medicalRecords.length} Records found
              </p>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center glass-elevated rounded-3xl p-10">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20">
              <FaFileMedicalAlt className="text-primary text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-text mb-3">No Medical Records Found</h3>
            <p className="text-secondary mb-8 max-w-md mx-auto">
              Your medical history will appear here chronologically once your doctors add records to your profile.
            </p>
            <button onClick={handleRefresh} className="glass-cta px-10 py-4 rounded-2xl font-bold shadow-xl">
              Check for Updates
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalHistoryPage;
