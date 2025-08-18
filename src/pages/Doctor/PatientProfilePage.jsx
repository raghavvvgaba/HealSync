import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { getSharedProfileRecord, getPatientBasicInfo, getPatientProfile } from '../../utils/firestoreDoctorService';
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaCalendar, FaMapMarkerAlt, FaSpinner, FaFileMedicalAlt, FaHeart, FaRunning, FaUtensils, FaPills, FaDownload, FaEye } from 'react-icons/fa';
import { GiBodyHeight } from 'react-icons/gi';
import { MdBloodtype, MdSick, MdAccessibility } from 'react-icons/md';
import { BsCapsulePill, BsEyeFill, BsEarFill } from 'react-icons/bs';
import { AiOutlineWarning } from 'react-icons/ai';

function PatientProfilePage() {
    const { shareId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [shareRecord, setShareRecord] = useState(null);
    const [patientProfile, setPatientProfile] = useState(null);
    const [patientInfo, setPatientInfo] = useState({ name: '', email: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'medical-records'

    // Dummy medical records data
    const medicalRecords = [
        {
            visitDate: "2025-05-16",
            doctor: { name: "Dr. Priya Mehta", id: "D-4562" },
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
            visitDate: "2025-04-10",
            doctor: { name: "Dr. Rajesh Kumar", id: "D-3421" },
            symptoms: ["Dry eyes", "Eye strain"],
            diagnosis: "Eye Checkup",
            medicines: ["Lubricant drops"],
            prescribedTests: ["Vision Test"],
            followUpNotes: "Use computer glasses for extended screen time.",
            fileName: "eye_checkup.jpeg",
            fileType: "image",
            fileUrl: "/files/eye_checkup.jpeg"
        },
        {
            visitDate: "2025-03-15",
            doctor: { name: "Dr. Sarah Johnson", id: "D-5678" },
            symptoms: ["Chest pain", "Shortness of breath"],
            diagnosis: "Cardiac Evaluation",
            medicines: ["Aspirin 75mg", "Atorvastatin"],
            prescribedTests: ["ECG", "Echocardiogram", "Stress Test"],
            followUpNotes: "Regular exercise and diet modification recommended.",
            fileName: "cardiac_report.pdf",
            fileType: "pdf",
            fileUrl: "/files/cardiac_report.pdf"
        }
    ];

    useEffect(() => {
        if (!user) return;
        fetchSharedProfile();
    }, [user, shareId]);

    const fetchSharedProfile = async () => {
        try {
            setLoading(true);
            
            // Step 1: Get and validate shared profile record
            const shareResult = await getSharedProfileRecord(shareId, user.uid);
            if (!shareResult.success) {
                setError(shareResult.error);
                return;
            }
            setShareRecord(shareResult.data);

            // Step 2: Get patient basic info (name, email)
            const patientInfoResult = await getPatientBasicInfo(shareResult.data.patientId);
            if (patientInfoResult.success) {
                setPatientInfo(patientInfoResult.data);
            }

            // Step 3: Get patient profile data
            const profileResult = await getPatientProfile(shareResult.data.patientId);
            if (!profileResult.success) {
                setError(profileResult.error);
                return;
            }
            setPatientProfile(profileResult.data);

        } catch (error) {
            console.error("Error fetching shared profile:", error);
            setError("Failed to load patient profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const InfoCard = ({ title, icon: Icon, children, className = "" }) => (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
            <div className="flex items-center gap-3 mb-4">
                <Icon className="text-primary text-xl" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            </div>
            {children}
        </div>
    );

    const DataField = ({ label, value, icon: Icon }) => (
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center gap-2">
                {Icon && <Icon className="text-primary text-sm" />}
                <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {value || 'Not specified'}
            </span>
        </div>
    );

    const TagList = ({ items, colorClass = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" }) => (
        <div className="flex flex-wrap gap-2">
            {items && items.length > 0 ? (
                items.map((item, index) => (
                    <span key={index} className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                        {item}
                    </span>
                ))
            ) : (
                <span className="text-sm text-gray-500 italic">None specified</span>
            )}
        </div>
    );

    const MedicalRecordCard = ({ record }) => (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{record.diagnosis}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {record.doctor.name} • {new Date(record.visitDate).toLocaleDateString()}
                    </p>
                </div>
                {record.fileName && (
                    <div className="flex gap-2">
                        <button className="p-2 text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <FaEye className="text-sm" />
                        </button>
                        <button className="p-2 text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <FaDownload className="text-sm" />
                        </button>
                    </div>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Symptoms</p>
                    <TagList items={record.symptoms} colorClass="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" />
                </div>
                
                <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Medicines</p>
                    <TagList items={record.medicines} colorClass="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" />
                </div>
                
                {record.prescribedTests && record.prescribedTests.length > 0 && (
                    <div className="md:col-span-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prescribed Tests</p>
                        <TagList items={record.prescribedTests} colorClass="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" />
                    </div>
                )}
                
                {record.followUpNotes && (
                    <div className="md:col-span-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Follow-up Notes</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            {record.followUpNotes}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading patient profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 max-w-md w-full text-center">
                    <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
                        Access Denied
                    </h2>
                    <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/doctor')}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-secondary transition-colors"
                >
                    <FaArrowLeft />
                    <span>Back to Patient List</span>
                </button>
                <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Shared on {shareRecord?.sharedAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                    </p>
                </div>
            </div>

            {/* Patient Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <FaUser className="text-2xl text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {patientInfo.name || 'Patient Name'}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <FaEnvelope className="text-sm" />
                            {patientInfo.email || 'No email provided'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-colors ${
                        activeTab === 'profile'
                            ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                    <FaUser className="text-sm" />
                    Profile Information
                </button>
                <button
                    onClick={() => setActiveTab('medical-records')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-colors ${
                        activeTab === 'medical-records'
                            ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                    <FaFileMedicalAlt className="text-sm" />
                    Medical Records
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'profile' && patientProfile && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Basic Information */}
                    <InfoCard title="Basic Information" icon={FaUser}>
                        <div className="space-y-3">
                            <DataField label="Full Name" value={patientProfile.basic?.fullName} icon={FaUser} />
                            <DataField label="Gender" value={patientProfile.basic?.gender} />
                            <DataField 
                                label="Date of Birth" 
                                value={patientProfile.basic?.dob ? new Date(patientProfile.basic.dob).toLocaleDateString() : null} 
                                icon={FaCalendar} 
                            />
                            <DataField label="Contact Number" value={patientProfile.basic?.contactNumber} icon={FaPhone} />
                        </div>
                    </InfoCard>

                    {/* Physical Details */}
                    <InfoCard title="Physical Details" icon={GiBodyHeight}>
                        <div className="space-y-3">
                            <DataField 
                                label="Height" 
                                value={patientProfile.basic?.height ? `${patientProfile.basic.height.value} ${patientProfile.basic.height.unit}` : null} 
                                icon={GiBodyHeight} 
                            />
                            <DataField 
                                label="Weight" 
                                value={patientProfile.basic?.weight ? `${patientProfile.basic.weight.value} ${patientProfile.basic.weight.unit}` : null} 
                                icon={MdSick} 
                            />
                            <DataField label="Blood Group" value={patientProfile.basic?.bloodGroup} icon={MdBloodtype} />
                        </div>
                    </InfoCard>

                    {/* Emergency Contact */}
                    <InfoCard title="Emergency Contact" icon={FaPhone}>
                        <div className="space-y-3">
                            <DataField label="Name" value={patientProfile.basic?.emergencyContact?.name} icon={FaUser} />
                            <DataField label="Phone" value={patientProfile.basic?.emergencyContact?.number} icon={FaPhone} />
                            <DataField label="Relation" value={patientProfile.basic?.emergencyContact?.relation} />
                        </div>
                    </InfoCard>

                    {/* Chronic Conditions */}
                    <InfoCard title="Chronic Conditions" icon={FaHeart}>
                        <TagList items={patientProfile.medical?.chronicConditions} colorClass="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" />
                    </InfoCard>

                    {/* Allergies */}
                    <InfoCard title="Allergies" icon={AiOutlineWarning}>
                        <TagList items={patientProfile.medical?.allergies} colorClass="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" />
                    </InfoCard>

                    {/* Current Medications */}
                    <InfoCard title="Current Medications" icon={BsCapsulePill}>
                        <TagList items={patientProfile.medical?.currentMedications} colorClass="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" />
                    </InfoCard>

                    {/* Disabilities */}
                    <InfoCard title="Disabilities" icon={MdAccessibility}>
                        <TagList items={patientProfile.medical?.disabilities} colorClass="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" />
                    </InfoCard>

                    {/* Vision & Hearing */}
                    <InfoCard title="Vision & Hearing" icon={BsEyeFill}>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <span className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                    <BsEyeFill className="text-primary" />
                                    Wears Glasses
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${patientProfile.medical?.vision?.wearsGlasses ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {patientProfile.medical?.vision?.wearsGlasses ? 'Yes' : 'No'}
                                </span>
                            </div>
                            {patientProfile.medical?.vision?.wearsGlasses && (
                                <>
                                    <DataField label="Left Eye" value={patientProfile.medical?.vision?.leftEye} />
                                    <DataField label="Right Eye" value={patientProfile.medical?.vision?.rightEye} />
                                </>
                            )}
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <span className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                    <BsEarFill className="text-primary" />
                                    Uses Hearing Aids
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${patientProfile.medical?.hearingAids ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {patientProfile.medical?.hearingAids ? 'Yes' : 'No'}
                                </span>
                            </div>
                        </div>
                    </InfoCard>

                    {/* Lifestyle Habits */}
                    <InfoCard title="Lifestyle Habits" icon={FaRunning}>
                        <TagList items={patientProfile.lifestyle?.habits} colorClass="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" />
                    </InfoCard>

                    {/* Dietary Preferences */}
                    <InfoCard title="Dietary Preferences" icon={FaUtensils}>
                        <TagList items={patientProfile.lifestyle?.preferences} colorClass="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" />
                    </InfoCard>
                </div>
            )}

            {/* Medical Records Tab */}
            {activeTab === 'medical-records' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Medical Records</h2>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {medicalRecords.length} record(s) found
                        </span>
                    </div>
                    
                    {medicalRecords.length > 0 ? (
                        <div className="space-y-4">
                            {medicalRecords.map((record, index) => (
                                <MedicalRecordCard key={index} record={record} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <FaFileMedicalAlt className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Medical Records</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                This patient hasn't uploaded any medical records yet.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {!patientProfile && !loading && (
                <div className="text-center py-12">
                    <FaUser className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Profile Data</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        This patient hasn't completed their profile yet.
                    </p>
                </div>
            )}
        </div>
    );
}

export default PatientProfilePage;