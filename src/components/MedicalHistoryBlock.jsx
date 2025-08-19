import MedicalRecordCard from './MedicalRecordCard';
import MedicalHistoryPage from './MedicalHistoryPage';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaFileMedicalAlt, FaCalendarAlt, FaStethoscope, FaPlus } from 'react-icons/fa';

const MedicalHistoryBlock = ({ records }) => {
  const recentRecords = records?.slice(0, 3) || [];
  const totalRecords = records?.length || 0;

  return (
  <div className="relative p-6 shadow-lg text-text border-2 border-surface flex flex-col gap-6 rounded-xl bg-[#181F2A] dark:bg-[#181F2A] hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaFileMedicalAlt size={24} className="text-teal-600 dark:text-teal-400" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Medical History</h2>
        </div>
        <span className="bg-teal-100 dark:bg-teal-800 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-full text-sm font-medium">
          {totalRecords} {totalRecords === 1 ? 'record' : 'records'}
        </span>
      </div>

      {/* Recent Records Preview */}
      {recentRecords.length > 0 ? (
        <div className="space-y-3">
          {recentRecords.map((record, index) => (
            <div 
              key={index}
              className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FaStethoscope className="text-teal-600 dark:text-teal-400 text-sm" />
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                    {record.diagnosis || 'General Checkup'}
                  </h3>
                </div>
                {record.visitDate && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <FaCalendarAlt />
                    {new Date(record.visitDate).toLocaleDateString()}
                  </span>
                )}
              </div>
              
              {record.doctor && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span className="font-medium">Doctor:</span> {record.doctor.name}
                </p>
              )}
              
              {record.symptoms && record.symptoms.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {record.symptoms.slice(0, 3).map((symptom, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded text-xs"
                    >
                      {symptom}
                    </span>
                  ))}
                  {record.symptoms.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded text-xs">
                      +{record.symptoms.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <FaFileMedicalAlt className="text-gray-400 text-4xl mb-4 mx-auto" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">No medical records yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">Your medical history will appear here</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
        <Link
          to="medical-history"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105"
        >
          <FaFileMedicalAlt className="text-sm" />
          <span className="font-medium">View All Records</span>
          <FaArrowRight className="text-sm" />
        </Link>
      </div>

      {/* Footer */}
      <div className="pt-2">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Keep your medical records updated and organized
        </p>
      </div>
    </div>
  );
};

export default MedicalHistoryBlock;
