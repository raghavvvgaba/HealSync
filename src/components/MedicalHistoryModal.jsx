import React from 'react';
import MedicalRecordCard from './MedicalRecordCard';
import { FiX } from 'react-icons/fi';

const MedicalHistoryModal = ({ records, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-surface rounded-2xl p-6 pt-8 max-h-[90vh] w-full max-w-2xl overflow-y-auto relative shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 pt-5 right-4 text-primary hover:text-accent"
        >
          <FiX size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Full Medical History</h2>

        <div className="space-y-4">
          {records.map((rec, idx) => (
            <MedicalRecordCard key={idx} record={rec} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryModal;
