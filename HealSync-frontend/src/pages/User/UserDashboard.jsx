import ProfileBlock from '../../components/ProfileBlock';
import MedicalHistoryBlock from '../../components/MedicalHistoryBlock';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/authContext';


const dummyUser = {
    firstName: 'Ravi',
    lastName: 'Kumar',
    height: 172,
    bloodGroup: 'B+',
    diseases: ['Diabetes', 'High BP', 'Wears Specs'],
};
const dummyRecords = [
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




const UserDashboard = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className='h-[calc(100vh-64px)] grid grid-cols-6 gap-3'>
                <div className='col-span-5 p-5 overflow-auto'>
                    <div className='flex flex-col gap-4 md:grid md:grid-cols-2'>
                        <ProfileBlock />
                        <MedicalHistoryBlock records={dummyRecords}/>
                    </div>
                </div>
            </div>

        </>
    );
};

export default UserDashboard;
