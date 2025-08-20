import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { getSharedProfileRecord, getPatientBasicInfo, getPatientProfile, getDoctorPatientMedicalRecords, addMedicalRecord } from '../../utils/firestoreDoctorService';
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaCalendar, FaMapMarkerAlt, FaSpinner, FaFileMedicalAlt, FaHeart, FaRunning, FaUtensils, FaPills, FaDownload, FaEye, FaPlus, FaTimes, FaSave } from 'react-icons/fa';
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
    
    // Medical records state
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [medicalRecordsLoading, setMedicalRecordsLoading] = useState(false);
    const [medicalRecordsError, setMedicalRecordsError] = useState(null);
    const [pagination, setPagination] = useState({
        hasMore: false,
        lastDoc: null,
        currentPageSize: 0,
        requestedPageSize: 20
    });
    
    // Add medical record modal state
    const [showAddRecordModal, setShowAddRecordModal] = useState(false);
    const [addingRecord, setAddingRecord] = useState(false);

    useEffect(() => {
        if (!user) return;
        fetchSharedProfile();
    }, [user, shareId]);

    useEffect(() => {
        if (shareRecord && activeTab === 'medical-records') {
            fetchMedicalRecords();
        }
    }, [shareRecord, activeTab]);

    const fetchMedicalRecords = async (loadMore = false) => {
        if (!shareRecord) return;
        
        try {
            setMedicalRecordsLoading(true);
            setMedicalRecordsError(null);
            
            const lastDoc = loadMore ? pagination.lastDoc : null;
            const result = await getDoctorPatientMedicalRecords(
                user.uid, 
                shareRecord.patientId, 
                lastDoc, 
                20
            );
            
            if (result.success) {
                if (loadMore) {
                    setMedicalRecords(prev => [...prev, ...result.data]);
                } else {
                    setMedicalRecords(result.data);
                }
                setPagination(result.pagination);
            } else {
                setMedicalRecordsError(result.error);
            }
        } catch (error) {
            console.error("Error fetching medical records:", error);
            setMedicalRecordsError("Failed to load medical records.");
        } finally {
            setMedicalRecordsLoading(false);
        }
    };

    const handleAddMedicalRecord = async (formData) => {
        if (!shareRecord) return;
        
        try {
            setAddingRecord(true);
            const result = await addMedicalRecord(user.uid, shareRecord.patientId, formData);
            
            if (result.success) {
                setShowAddRecordModal(false);
                // Refresh medical records
                fetchMedicalRecords();
            } else {
                alert(result.error || 'Failed to add medical record');
            }
        } catch (error) {
            console.error('Error adding medical record:', error);
            alert('Failed to add medical record. Please try again.');
        } finally {
            setAddingRecord(false);
        }
    };

    const AddMedicalRecordModal = () => {
        const [formData, setFormData] = useState({
            visitDate: new Date().toISOString().split('T')[0],
            diagnosis: '',
            symptoms: '',
            medicines: '',
            prescribedTests: '',
            followUpNotes: ''
        });

        const handleSubmit = (e) => {
            e.preventDefault();
            
            // Convert comma-separated strings to arrays
            const processedData = {
                ...formData,
                symptoms: formData.symptoms.split(',').map(s => s.trim()).filter(s => s),
                medicines: formData.medicines.split(',').map(m => m.trim()).filter(m => m),
                prescribedTests: formData.prescribedTests.split(',').map(t => t.trim()).filter(t => t)
            };
            
            handleAddMedicalRecord(processedData);
        };

        if (!showAddRecordModal) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Medical Record</h2>
                            <button
                                onClick={() => setShowAddRecordModal(false)}
                                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Visit Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.visitDate}
                                    onChange={(e) => setFormData(prev => ({ ...prev, visitDate: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Diagnosis
                                </label>
                                <input
                                    type="text"
                                    value={formData.diagnosis}
                                    onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter diagnosis"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Symptoms (comma-separated)
                                </label>
                                <textarea
                                    value={formData.symptoms}
                                    onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    rows="2"
                                    placeholder="e.g., Headache, Nausea, Fever"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Medicines (comma-separated)
                                </label>
                                <textarea
                                    value={formData.medicines}
                                    onChange={(e) => setFormData(prev => ({ ...prev, medicines: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    rows="2"
                                    placeholder="e.g., Paracetamol 500mg, Ibuprofen 200mg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Prescribed Tests (comma-separated)
                                </label>
                                <textarea
                                    value={formData.prescribedTests}
                                    onChange={(e) => setFormData(prev => ({ ...prev, prescribedTests: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    rows="2"
                                    placeholder="e.g., Blood Test, X-Ray, MRI"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Follow-up Notes
                                </label>
                                <textarea
                                    value={formData.followUpNotes}
                                    onChange={(e) => setFormData(prev => ({ ...prev, followUpNotes: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    rows="3"
                                    placeholder="Any additional notes or follow-up instructions"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={addingRecord}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {addingRecord ? (
                                        <>
                                            <FaSpinner className="animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <FaSave />
                                            Save Record
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddRecordModal(false)}
                                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    };

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
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{record.diagnosis || 'Medical Record'}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {record.visitDate ? new Date(record.visitDate).toLocaleDateString() : 'No date specified'}
                        {record.createdAt ? ` at ${new Date(record.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                        {' '}
                        • {record.doctorName || 'Unknown Doctor'}
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
        <>
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
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {medicalRecords.length} record(s) found
                            </span>
                            <button
                                onClick={() => setShowAddRecordModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                <FaPlus className="text-sm" />
                                Add Medical Record
                            </button>
                        </div>
                    </div>
                    
                    {medicalRecordsError && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <p className="text-red-600 dark:text-red-300">{medicalRecordsError}</p>
                            <button
                                onClick={() => fetchMedicalRecords()}
                                className="mt-2 text-sm text-red-700 dark:text-red-400 hover:underline"
                            >
                                Try again
                            </button>
                        </div>
                    )}
                    
                    {medicalRecordsLoading && medicalRecords.length === 0 ? (
                        <div className="text-center py-12">
                            <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400">Loading medical records...</p>
                        </div>
                    ) : medicalRecords.length > 0 ? (
                        <div className="space-y-4">
                            {medicalRecords.map((record, index) => (
                                <MedicalRecordCard key={record.id || index} record={record} />
                            ))}
                            
                            {/* Load More Button */}
                            {pagination.hasMore && (
                                <div className="text-center py-4">
                                    <button
                                        onClick={() => fetchMedicalRecords(true)}
                                        disabled={medicalRecordsLoading}
                                        className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {medicalRecordsLoading ? (
                                            <span className="flex items-center gap-2">
                                                <FaSpinner className="animate-spin" />
                                                Loading...
                                            </span>
                                        ) : (
                                            'Load More Records'
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <FaFileMedicalAlt className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Medical Records</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                No medical records found for this patient.
                            </p>
                            <button
                                onClick={() => setShowAddRecordModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity mx-auto"
                            >
                                <FaPlus className="text-sm" />
                                Add First Medical Record
                            </button>
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
        
        {/* Add Medical Record Modal */}
        <AddMedicalRecordModal />
        </>
    );
}

export default PatientProfilePage;