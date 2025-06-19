import MedicalRecordCard from './MedicalRecordCard';
import MedicalHistoryPage from './MedicalHistoryPage';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa'

const MedicalHistoryBlock = ({ records }) => {
  const previewCount = 1;
  console.log(records + "from block");

  return (
    <>
      <div className="bg-surface h-48 text-text rounded-2xl p-6 shadow-md">
        <h1 className='text-xl font-semibold mb-4'>Medical History</h1>
        <button className='text-sm md:text-base px-4 py-2 rounded-xl bg-primary dark:bg-secondary text-text hover:scale-105 transition-all flex gap-2 group'>
         <Link to='medical-history'
          >View Medical History</Link>
        <FaArrowRight className='translate-y-1 group-hover:animate-pulse transition-all duration-500'/>
        </button>
      </div>

    </>
  );
};

export default MedicalHistoryBlock;
