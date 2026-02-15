import MedicalRecordCard from './MedicalRecordCard';
import MedicalHistoryPage from './MedicalHistoryPage';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaFileMedicalAlt, FaCalendarAlt, FaStethoscope, FaPlus, FaRedo, FaExclamationTriangle, FaChevronRight } from 'react-icons/fa';

const MedicalHistoryBlock = ({ records, loading, error, onRefresh }) => {
  const recentRecords = records?.slice(0, 3) || [];
  const totalRecords = records?.length || 0;

  const formatDate = (dateString) => {
    if (!dateString) return { month: '---', day: '--' };
    const date = new Date(dateString);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: date.getDate()
    };
  };

  return (
  <div className="glass rounded-2xl p-6 border soft-divider flex flex-col gap-6 hover-glow-primary">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl glass-cta text-white flex items-center justify-center shadow-lg">
            <FaFileMedicalAlt className="text-lg" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text leading-tight">Medical History</h2>
            <p className="text-xs text-secondary">Recent checkups & diagnoses</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-surface/50 text-secondary hover:text-primary transition-colors disabled:opacity-50"
              title="Refresh records"
            >
              <FaRedo className={`text-sm ${loading ? 'animate-spin' : ''}`} />
            </button>
          )}
          <span className="glass px-2.5 py-1 rounded-lg text-xs font-semibold text-text border soft-divider">
            {totalRecords}
          </span>
        </div>
      </div>

      {/* Loading State */}
    {loading && (
        <div className="py-12 flex flex-col items-center justify-center text-secondary gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
          <p className="text-xs font-medium">Loading history...</p>
        </div>
      )}

      {/* Error State */}
    {error && !loading && (
        <div className="py-8 text-center bg-red-500/5 rounded-xl border border-red-500/10">
          <FaExclamationTriangle className="text-red-500 text-2xl mb-2 mx-auto" />
          <p className="text-red-500 text-sm font-medium mb-3">{error}</p>
          {onRefresh && (
            <button onClick={onRefresh} className="text-xs glass-cta px-3 py-1.5 rounded-lg">
              Retry
            </button>
          )}
        </div>
      )}

      {/* Recent Records Preview */}
      {!loading && !error && (
        <>
          {recentRecords.length > 0 ? (
            <div className="flex flex-col">
              {recentRecords.map((record, index) => {
                const { month, day } = formatDate(record.visitDate);
                return (
                  <div 
                    key={record.id || index}
                    className="group flex gap-4 py-4 border-b border-dashed soft-divider last:border-0 hover:bg-surface/30 transition-colors rounded-xl px-2 -mx-2 cursor-pointer"
                  >
                    {/* Date Box */}
                    <div className="flex flex-col items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-surface/50 rounded-2xl border soft-divider shrink-0 group-hover:scale-105 transition-transform group-hover:border-primary/30">
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">{month}</span>
                      <span className="text-lg sm:text-xl font-bold text-primary leading-none">{day}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-text text-sm sm:text-base truncate pr-2">
                          {record.diagnosis || 'General Checkup'}
                        </h3>
                        <FaChevronRight className="text-secondary/30 text-xs mt-1 shrink-0 group-hover:text-primary transition-colors" />
                      </div>
                      
                      <p className="text-xs text-secondary truncate mb-2">
                        {record.doctorName || record.doctor?.name || 'Unknown Doctor'}
                      </p>
                      
                      {/* Symptoms Tags */}
                      {record.symptoms && record.symptoms.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {record.symptoms.slice(0, 2).map((symptom, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-surface/50 text-secondary border soft-divider"
                            >
                              {symptom}
                            </span>
                          ))}
                          {record.symptoms.length > 2 && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-surface/50 text-secondary border soft-divider">
                              +{record.symptoms.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-10 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-surface/50 flex items-center justify-center">
                <FaFileMedicalAlt className="text-secondary/50 text-xl" />
              </div>
              <p className="text-secondary text-sm">No medical records found</p>
            </div>
          )}

          {/* Footer Action */}
          <div className="pt-2">
            <Link
              to="medical-history"
              className="w-full glass-cta flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold hover:shadow-lg transition-all active:scale-[0.98]"
            >
              View Full History <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default MedicalHistoryBlock;
