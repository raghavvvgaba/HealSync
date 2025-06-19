import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import MedicalRecordCard from '../components/MedicalRecordCard';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// replace this dummy data wih data from context api
const records = [
  {
    visitDate: "2025-05-16",
    doctor: {
      name: "Dr. Priya Mehta",
      id: "D-4562"
    },
    symptoms: ["Headaches", "Nausea", "Vomiting"],
    diagnosis: "Migraine",
    medicines: ["Paracetamol 500mg", "Sumatriptan"],
    prescribedTests: ["MRI Brain", "Blood Test"],
    followUpNotes: "Follow-up in 2 weeks if symptoms persist.",
    fileName: "migraine-prescription.pdf",
    fileType: "pdf",
    fileUrl: "https://example.com/record.pdf"
  },
  {
    symptoms: ['Headaches', 'Nausea', 'Vomiting'],
    diagnosis: 'Migraine',
    medicines: ['Paracetamol 500mg', 'Sumatriptan'],
    fileName: 'migraine_report.pdf',
    fileType: 'pdf',
    fileUrl: '/files/migraine_report.pdf',
  },
  {
    symptoms: ['Headaches', 'Nausea', 'Vomiting'],
    diagnosis: 'Eye Checkup',
    medicines: ['Lubricant drops'],
    fileName: 'eye_checkup.jpeg',
    fileType: 'image',
    fileUrl: '/files/eye_checkup.jpeg',
  },
  {
    symptoms: ['Headaches', 'Nausea', 'Vomiting'],
    diagnosis: 'Eye Checkup',
    medicines: ['Lubricant drops'],
    fileName: 'eye_checkup.jpeg',
    fileType: 'image',
    fileUrl: '/files/eye_checkup.jpeg',
  },
  {
    symptoms: ['Headaches', 'Nausea', 'Vomiting'],
    diagnosis: 'Eye Checkup',
    medicines: ['Lubricant drops'],
    fileName: 'eye_checkup.jpeg',
    fileType: 'image',
    fileUrl: '/files/eye_checkup.jpeg',
  },
  {
    symptoms: ['Headaches', 'Nausea', 'Vomiting'],
    diagnosis: 'Migraine',
    medicines: ['Paracetamol 500mg', 'Sumatriptan'],
    fileName: 'migraine_report.pdf',
    fileType: 'pdf',
    fileUrl: '/files/migraine_report.pdf',
  },
  {
    symptoms: ['Headaches', 'Nausea', 'Vomiting'],
    diagnosis: 'Migraine',
    medicines: ['Paracetamol 500mg', 'Sumatriptan'],
    fileName: 'migraine_report.pdf',
    fileType: 'pdf',
    fileUrl: '/files/migraine_report.pdf',
  },
  {
    symptoms: ['Headaches', 'Nausea', 'Vomiting'],
    diagnosis: 'Migraine',
    medicines: ['Paracetamol 500mg', 'Sumatriptan'],
    fileName: 'migraine_report.pdf',
    fileType: 'pdf',
    fileUrl: '/files/migraine_report.pdf',
  },
];

const MedicalHistoryPage = ({ direction = 1 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <motion.div
      className="min-h-screen bg-background text-text px-4 py-6 sm:px-6"
      initial={{ x: direction > 0 ? '100%' : '-100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: direction > 0 ? '-100%' : '100%', opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="sticky top-0 z-10 bg-background pb-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary hover:text-accent mb-6"
        >
          <FiArrowLeft size={20} />
          <span className="text-base font-medium">Back</span>
        </button>
      </div>


      <h1 className="text-2xl font-bold mb-6">Your Full Medical History</h1>

      {records.length > 0 ? (
        <div className="flex flex-col gap-6">
          {records.map((rec, idx) => (
            <MedicalRecordCard key={idx} record={rec} />
          ))}
        </div>
      ) : (
        <p className="text-secondary text-sm">No medical records found.</p>
      )}
    </motion.div>
  );
};

export default MedicalHistoryPage;
