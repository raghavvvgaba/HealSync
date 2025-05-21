import MedicalRecordCard from './MedicalRecordCard';
import MedicalHistoryPage from './MedicalHistoryPage';
import { Link } from 'react-router-dom';

const MedicalHistoryBlock = ({ records }) => {
  const previewCount = 1;
  console.log(records + "from block");

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
            <Link
              to="medical-history"
              state={{ records }}
              className="text-primary hover:underline text-sm font-medium"
            >
              View All Records
            </Link>
          </div>
        )}
      </div>

    </>
  );
};

export default MedicalHistoryBlock;
