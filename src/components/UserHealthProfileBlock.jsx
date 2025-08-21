import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { getUserProfile } from '../utils/firestoreService';
import { FaUserCircle, FaHeartbeat, FaWeight, FaRulerVertical, FaTint, FaCalendarAlt, FaEdit, FaEye } from 'react-icons/fa';
import { MdBloodtype, MdSick } from 'react-icons/md';
import { Link } from 'react-router-dom';

const UserHealthProfileBlock = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user?.uid) {
        try {
          setLoading(true);
          const result = await getUserProfile(user.uid);
          if (result.success) {
            setProfileData(result.data);
          } else {
            setError('Failed to load profile data');
          }
        } catch (error) {
          setError('An error occurred while loading data');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProfileData();
  }, [user]);

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Calculate BMI
  const calculateBMI = (weight, height) => {
    if (!weight?.value || !height?.value) return null;
    const weightInKg = weight.unit === 'lbs' ? weight.value * 0.453592 : weight.value;
    const heightInM = height.unit === 'ft' ? height.value * 0.3048 : height.value / 100;
    return (weightInKg / (heightInM * heightInM)).toFixed(1);
  };

  if (loading) {
    return (
      <div className="relative p-6 shadow-lg text-text border-2 border-surface flex flex-col gap-6 rounded-xl bg-white dark:bg-gray-800">
        <div className="animate-pulse h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
        <div className="animate-pulse h-4 bg-gray-300 rounded w-1/3"></div>
      </div>
    );
  }

  if (error || !profileData?.basic) {
    return (
      <div className="relative p-6 shadow-lg text-text border-2 border-surface flex flex-col gap-6 rounded-xl bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <FaUserCircle size={32} className="text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Profile data not available</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error || 'Complete your profile to see your health overview.'}</p>
        <Link to="edit-profile" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <FaEdit /> Complete Profile
        </Link>
      </div>
    );
  }

  const { basic, medical } = profileData;
  const age = calculateAge(basic.dob);
  const bmi = calculateBMI(basic.weight, basic.height);

  return (
    <div className="relative p-6 shadow-lg text-text border-2 border-surface flex flex-col gap-6 rounded-xl bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
          <FaUserCircle size={32} className="text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{basic.fullName || 'Unknown User'}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Patient ID: {user?.uid?.substring(0, 8).toUpperCase() || 'N/A'}</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div className="p-4 bg-[#232B38] dark:bg-[#232B38] rounded-xl flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1"><FaRulerVertical className="text-blue-400" /><span className="text-xs font-medium text-gray-300">Height</span></div>
          <span className="text-lg font-bold text-white">{basic.height?.value} {basic.height?.unit || 'cm'}</span>
        </div>
        <div className="p-4 bg-[#232B38] dark:bg-[#232B38] rounded-xl flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1"><FaWeight className="text-purple-400" /><span className="text-xs font-medium text-gray-300">Weight</span></div>
          <span className="text-lg font-bold text-white">{basic.weight?.value} {basic.weight?.unit || 'kg'}</span>
        </div>
        <div className="p-4 bg-[#232B38] dark:bg-[#232B38] rounded-xl flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1"><FaTint className="text-red-400" /><span className="text-xs font-medium text-gray-300">Blood Group</span></div>
          <span className="text-lg font-bold text-white">{basic.bloodGroup || 'Not set'}</span>
        </div>
        <div className="p-4 bg-[#232B38] dark:bg-[#232B38] rounded-xl flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1"><FaCalendarAlt className="text-orange-400" /><span className="text-xs font-medium text-gray-300">Age</span></div>
          <span className="text-lg font-bold text-white">{age ? `${age} years` : 'Not set'}</span>
        </div>
        <div className="p-4 bg-[#232B38] dark:bg-[#232B38] rounded-xl flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1"><MdBloodtype className="text-red-400" /><span className="text-xs font-medium text-gray-300">Blood Type</span></div>
          <span className="text-lg font-bold text-white">{basic.bloodGroup || 'Not set'}</span>
        </div>
        <div className="p-4 bg-[#232B38] dark:bg-[#232B38] rounded-xl flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1"><MdSick className="text-green-400" /><span className="text-xs font-medium text-gray-300">Gender</span></div>
          <span className="text-lg font-bold text-white">{basic.gender || 'Not set'}</span>
        </div>
      </div>

      {/* BMI Section */}
      {bmi && (
        <div className="p-4 bg-[#232B38] dark:bg-[#232B38] rounded-xl border border-gray-700 mt-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <FaHeartbeat className="text-green-400" />
              <span className="font-medium text-gray-300">Body Mass Index (BMI)</span>
            </div>
            <span className="text-2xl font-bold text-green-400">{bmi}</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2 mb-2">
            <div 
              className={`h-2 rounded-full ${
                bmi < 18.5 ? 'bg-blue-500' :
                bmi < 25 ? 'bg-green-500' :
                bmi < 30 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min((bmi / 35) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400">
            {bmi < 18.5 ? 'Underweight' :
             bmi < 25 ? 'Normal weight' :
             bmi < 30 ? 'Overweight' : 'Obese'}
          </p>
        </div>
      )}

      {/* Medical Conditions */}
      {medical?.conditions && medical.conditions.length > 0 && (
        <div className="p-4 bg-[#232B38] dark:bg-[#232B38] rounded-xl border border-gray-700 mt-2">
          <h3 className="font-semibold text-gray-200 mb-3">Medical Conditions</h3>
          <div className="flex flex-wrap gap-2">
            {medical.conditions.slice(0, 4).map((condition, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-orange-900 text-orange-300 rounded-full text-sm"
              >
                {condition}
              </span>
            ))}
            {medical.conditions.length > 4 && (
              <span className="px-3 py-1 bg-gray-600 text-gray-300 rounded-full text-sm">
                +{medical.conditions.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-700">
        <Link
          to="edit-profile"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105"
        >
          <FaEdit className="text-sm" />
          <span className="font-medium">Edit</span>
        </Link>
        <Link
          to="view-profile"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105"
        >
          <FaEye className="text-sm" />
          <span className="font-medium">View Full</span>
        </Link>
      </div>
      <div className="pt-2">
        <p className="text-xs text-gray-400 text-center">
          Keep your health information updated for better care
        </p>
      </div>
    </div>
  );
};

export default UserHealthProfileBlock;
