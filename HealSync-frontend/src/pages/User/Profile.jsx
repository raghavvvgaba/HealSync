import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaFileMedicalAlt, FaHeart, FaRunning, FaUtensils, FaEdit } from 'react-icons/fa';
import { GiBodyHeight } from 'react-icons/gi';
import { MdBloodtype, MdSick, MdPhone, MdEmail, MdCalendarToday, MdAccessibility } from 'react-icons/md';
import { BsCapsulePill, BsEyeFill, BsEarFill } from 'react-icons/bs';
import { AiOutlineWarning } from 'react-icons/ai';
import { Link } from 'react-router';
import { getUserProfile } from '../../utils/firestoreService';
import { useAuth } from '../../context/authContext';

export function Profile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user?.uid) {
        try {
          const result = await getUserProfile(user.uid);
          if (result.success) {
            setProfileData(result.data);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfileData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-300 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text mb-4">Profile Not Found</h2>
          <p className="text-gray-500 mb-6">Unable to load profile data</p>
          <Link 
            to="/user" 
            className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-accent transition-all"
          >
            Go Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { basic, medical, lifestyle } = profileData;

  const InfoCard = ({ title, icon: Icon, children, className = "" }) => (
    <div className={`relative bg-surface border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-accent group ${className}`}>
      <div className="absolute inset-0 bg-surface opacity-100 group-hover:opacity-90 transition-opacity duration-300 rounded-xl pointer-events-none z-0"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <Icon className="text-accent text-xl" />
          <h3 className="text-lg font-bold text-text">{title}</h3>
        </div>
        {children}
      </div>
    </div>
  );

  const DataField = ({ label, value, icon: Icon }) => (
    <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-accent-10 transition-all">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="text-accent text-sm" />}
        <span className="text-sm font-medium text-text">{label}</span>
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
        {value || 'Not specified'}
      </span>
    </div>
  );

  const TagList = ({ items, colorClass = "bg-accent-20 text-accent" }) => (
    <div className="flex flex-wrap gap-2">
      {items && items.length > 0 ? (
        items.map((item, index) => (
          <span
            key={index}
            className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass} border border-accent-30`}
          >
            {item}
          </span>
        ))
      ) : (
        <span className="text-sm text-gray-500 italic">None specified</span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto pb-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text mb-2">Complete Profile</h1>
            <p className="text-gray-600 dark:text-gray-400">
              View all your profile information
            </p>
          </div>
          <Link
            to="../edit-profile"
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl hover:bg-accent hover:scale-105 transition-all shadow-lg"
          >
            <FaEdit />
            Edit Profile
          </Link>
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          
          {/* Basic Information */}
          <InfoCard title="Basic Information" icon={FaUserCircle} className="lg:col-span-1">
            <div className="space-y-3">
              <DataField label="Full Name" value={basic?.fullName} icon={FaUserCircle} />
              <DataField label="Gender" value={basic?.gender} />
              <DataField 
                label="Date of Birth" 
                value={basic?.dob ? new Date(basic.dob).toLocaleDateString() : null} 
                icon={MdCalendarToday} 
              />
              <DataField label="Contact Number" value={basic?.contactNumber} icon={MdPhone} />
            </div>
          </InfoCard>

          {/* Physical Details */}
          <InfoCard title="Physical Details" icon={GiBodyHeight} className="lg:col-span-1">
            <div className="space-y-3">
              <DataField 
                label="Height" 
                value={basic?.height ? `${basic.height.value} ${basic.height.unit}` : null} 
                icon={GiBodyHeight} 
              />
              <DataField 
                label="Weight" 
                value={basic?.weight ? `${basic.weight.value} ${basic.weight.unit}` : null} 
                icon={MdSick} 
              />
              <DataField label="Blood Group" value={basic?.bloodGroup} icon={MdBloodtype} />
            </div>
          </InfoCard>

          {/* Emergency Contact */}
          <InfoCard title="Emergency Contact" icon={MdPhone} className="lg:col-span-1">
            <div className="space-y-3">
              <DataField label="Name" value={basic?.emergencyContact?.name} icon={FaUserCircle} />
              <DataField label="Phone" value={basic?.emergencyContact?.number} icon={MdPhone} />
              <DataField label="Relation" value={basic?.emergencyContact?.relation} />
            </div>
          </InfoCard>

          {/* Chronic Conditions */}
          <InfoCard title="Chronic Conditions" icon={FaHeart} className="lg:col-span-2 xl:col-span-1">
            <TagList items={medical?.chronicConditions} colorClass="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" />
          </InfoCard>

          {/* Allergies */}
          <InfoCard title="Allergies" icon={AiOutlineWarning} className="lg:col-span-2 xl:col-span-1">
            <TagList items={medical?.allergies} colorClass="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" />
          </InfoCard>

          {/* Current Medications */}
          <InfoCard title="Current Medications" icon={BsCapsulePill} className="lg:col-span-2 xl:col-span-1">
            <TagList items={medical?.currentMedications} colorClass="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" />
          </InfoCard>

          {/* Disabilities */}
          <InfoCard title="Disabilities" icon={MdAccessibility} className="lg:col-span-2 xl:col-span-1">
            <TagList items={medical?.disabilities} colorClass="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" />
          </InfoCard>

          {/* Vision & Hearing */}
          <InfoCard title="Vision & Hearing" icon={BsEyeFill} className="lg:col-span-1">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-gray-200 dark:border-gray-600">
                <span className="text-sm font-medium text-text flex items-center gap-2">
                  <BsEyeFill className="text-accent" />
                  Wears Glasses
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${medical?.vision?.wearsGlasses ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {medical?.vision?.wearsGlasses ? 'Yes' : 'No'}
                </span>
              </div>
              {medical?.vision?.wearsGlasses && (
                <>
                  <DataField label="Left Eye" value={medical?.vision?.leftEye} />
                  <DataField label="Right Eye" value={medical?.vision?.rightEye} />
                </>
              )}
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-gray-200 dark:border-gray-600">
                <span className="text-sm font-medium text-text flex items-center gap-2">
                  <BsEarFill className="text-accent" />
                  Uses Hearing Aids
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${medical?.hearingAids ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {medical?.hearingAids ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </InfoCard>

          {/* Lifestyle Habits */}
          <InfoCard title="Lifestyle Habits" icon={FaRunning} className="lg:col-span-2 xl:col-span-1">
            <TagList items={lifestyle?.habits} colorClass="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" />
          </InfoCard>

          {/* Dietary Preferences */}
          <InfoCard title="Dietary Preferences" icon={FaUtensils} className="lg:col-span-2 xl:col-span-1">
            <TagList items={lifestyle?.preferences} colorClass="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" />
          </InfoCard>

        </div>
      </div>
    </div>
  );
}
