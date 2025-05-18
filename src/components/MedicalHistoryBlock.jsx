import React, { useState } from 'react';
import MedicalRecordCard from './MedicalRecordCard';
import MedicalHistoryModal from './MedicalHistoryModal';

const MedicalHistoryBlock = ({ records }) => {
  const [showModal, setShowModal] = useState(false);
  const previewCount = 1;

  return (
    <>
      <div className="bg-surface text-text rounded-2xl p-6 shadow-md w-full">
        <h2 className="text-xl font-semibold mb-4">Medical History</h2>

        <div className="space-y-4">
          {records.slice(0, previewCount).map((rec, idx) => (
            <MedicalRecordCard key={idx} record={rec} />
          ))}
        </div>

        {records.length > previewCount && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowModal(true)}
              className="text-primary hover:underline text-sm font-medium"
            >
              View All Records
            </button>
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <MedicalHistoryModal records={records} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default MedicalHistoryBlock;
