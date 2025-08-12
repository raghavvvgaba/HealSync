import MedicalRecordCard from './MedicalRecordCard';
import MedicalHistoryPage from './MedicalHistoryPage';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa'

const MedicalHistoryBlock = ({ records }) => {
  const previewCount = 1;

  return (
    <>
      <div className="relative p-4 shadow text-text border-2 border-surface flex flex-col gap-6 rounded-xl group">
        {/* Semi-transparent background layer */}
        <div className="absolute inset-0 bg-surface opacity-100 group-hover:opacity-60 transition-opacity duration-300 rounded-xl pointer-events-none z-0"></div>
        <div className='relative z-10'>
          <h1 className='text-xl font-semibold mb-4'>Medical History</h1>
          <button className='text-sm md:text-base px-4 py-2 rounded-xl bg-primary dark:bg-secondary text-text hover:scale-105 transition-all flex gap-2 group'>
            <Link to='medical-history'
            >View Medical History</Link>
            <FaArrowRight className='translate-y-1 group-hover:animate-pulse transition-all duration-500' />
          </button>
        </div>
      </div>
    </>
  );
};

export default MedicalHistoryBlock;
