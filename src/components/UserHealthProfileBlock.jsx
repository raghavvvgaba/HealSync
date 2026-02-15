import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { getUserProfile } from '../utils/firestoreService';
import { FaUserCircle, FaHeartbeat, FaWeight, FaRulerVertical, FaTint, FaCalendarAlt, FaEdit, FaEye, FaPhoneAlt, FaExclamationTriangle } from 'react-icons/fa';
import { MdBloodtype, MdSick, MdEmergency } from 'react-icons/md';
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
      <div className="glass rounded-2xl p-6 border soft-divider">
        <div className="animate-pulse h-7 bg-surface/10 rounded w-1/2 mb-2"></div>
        <div className="animate-pulse h-4 bg-surface/10 rounded w-1/3"></div>
      </div>
    );
  }

  if (error || !profileData?.basic) {
    return (
      <div className="glass rounded-2xl p-6 border soft-divider">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <FaUserCircle />
          </div>
          <h2 className="text-lg font-bold text-text">Profile data not available</h2>
        </div>
        <p className="text-secondary mb-4">{error || 'Complete your profile to see your health overview.'}</p>
        <Link to="edit-profile" className="glass-cta inline-flex items-center gap-2 px-4 py-2 text-sm">
          <FaEdit /> Complete Profile
        </Link>
      </div>
    );
  }

  const { basic, medical } = profileData;
  const age = calculateAge(basic.dob);
  const bmi = calculateBMI(basic.weight, basic.height);
  const emergencyContact = basic.emergencyContact;

  return (
    <div className="glass rounded-2xl p-6 border soft-divider hover-glow-primary flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl glass-cta text-white flex items-center justify-center shadow-lg shrink-0">
          <FaUserCircle className="text-2xl" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-text truncate">{basic.fullName || 'Unknown User'}</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">
              ID: {user?.uid?.substring(0, 8).toUpperCase() || 'N/A'}
            </span>
            {basic.gender && (
              <span className="text-xs text-secondary capitalize border-l border-secondary/30 pl-3">
                {basic.gender}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Link to="view-profile" className="p-2 text-secondary hover:text-primary transition-colors" title="View Full Profile">
            <FaEye />
          </Link>
          <Link to="edit-profile" className="p-2 text-secondary hover:text-primary transition-colors" title="Edit Profile">
            <FaEdit />
          </Link>
        </div>
      </div>

      {/* Key Vitals Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-surface/50 rounded-xl border soft-divider">
          <div className="flex items-center gap-2 mb-1">
            <FaCalendarAlt className="text-orange-400 text-xs" />
            <span className="text-[10px] uppercase font-bold text-secondary tracking-wider">Age</span>
          </div>
          <span className="text-lg font-bold text-text">{age ? `${age}` : '-'}</span>
          <span className="text-xs text-secondary ml-1">yrs</span>
        </div>
        
        <div className="p-3 bg-surface/50 rounded-xl border soft-divider">
          <div className="flex items-center gap-2 mb-1">
            <FaTint className="text-red-500 text-xs" />
            <span className="text-[10px] uppercase font-bold text-secondary tracking-wider">Blood</span>
          </div>
          <span className="text-lg font-bold text-text">{basic.bloodGroup || '-'}</span>
        </div>

        <div className="p-3 bg-surface/50 rounded-xl border soft-divider">
          <div className="flex items-center gap-2 mb-1">
            <FaRulerVertical className="text-primary text-xs" />
            <span className="text-[10px] uppercase font-bold text-secondary tracking-wider">Height</span>
          </div>
          <span className="text-lg font-bold text-text">{basic.height?.value || '-'}</span>
          <span className="text-xs text-secondary ml-1">{basic.height?.unit || 'cm'}</span>
        </div>

        <div className="p-3 bg-surface/50 rounded-xl border soft-divider">
          <div className="flex items-center gap-2 mb-1">
            <FaWeight className="text-indigo-500 text-xs" />
            <span className="text-[10px] uppercase font-bold text-secondary tracking-wider">Weight</span>
          </div>
          <span className="text-lg font-bold text-text">{basic.weight?.value || '-'}</span>
          <span className="text-xs text-secondary ml-1">{basic.weight?.unit || 'kg'}</span>
        </div>

        <div className="p-3 bg-surface/50 rounded-xl border soft-divider sm:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <FaHeartbeat className="text-green-500 text-xs" />
              <span className="text-[10px] uppercase font-bold text-secondary tracking-wider">BMI</span>
            </div>
            {bmi && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                bmi < 18.5 ? 'bg-blue-500/10 text-blue-600' :
                bmi < 25 ? 'bg-green-500/10 text-green-600' :
                bmi < 30 ? 'bg-yellow-500/10 text-yellow-600' : 'bg-red-500/10 text-red-600'
              }`}>
                {bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'}
              </span>
            )}
          </div>
          <div className="flex items-end gap-2">
            <span className="text-lg font-bold text-text">{bmi || '-'}</span>
            {bmi && (
              <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-1.5 ml-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    bmi < 18.5 ? 'bg-blue-500' :
                    bmi < 25 ? 'bg-green-500' :
                    bmi < 30 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min((bmi / 35) * 100, 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Critical Medical Info */}
      <div className="space-y-3">
        {/* Allergies - Critical */}
        {medical?.allergies && medical.allergies.length > 0 && (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
            <FaExclamationTriangle className="text-red-500 mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block mb-1">Allergies</span>
              <div className="flex flex-wrap gap-1.5">
                {medical.allergies.map((allergy, idx) => (
                  <span key={idx} className="text-xs font-medium text-text bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded border border-red-500/10">
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chronic Conditions */}
        {medical?.chronicConditions && medical.chronicConditions.length > 0 ? (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface/50 border soft-divider">
            <MdSick className="text-amber-500 mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1">Chronic Conditions</span>
              <div className="flex flex-wrap gap-1.5">
                {medical.chronicConditions.map((condition, idx) => (
                  <span key={idx} className="text-xs font-medium text-text bg-white/50 dark:bg-white/5 px-2 py-0.5 rounded border soft-divider">
                    {condition}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl border border-dashed soft-divider text-center">
            <p className="text-xs text-secondary">No chronic conditions listed</p>
          </div>
        )}
      </div>

      {/* Emergency Contact */}
      {emergencyContact?.name && (
        <div className="pt-4 border-t soft-divider">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <MdEmergency className="text-red-500 text-sm" /> Emergency Contact
            </span>
            <a href={`tel:${emergencyContact.number}`} className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
              <FaPhoneAlt className="text-[10px]" /> Call
            </a>
          </div>
          <div className="flex items-center justify-between p-3 glass rounded-xl border soft-divider">
            <div>
              <p className="text-sm font-bold text-text">{emergencyContact.name}</p>
              <p className="text-xs text-secondary">{emergencyContact.relation}</p>
            </div>
            <p className="text-sm font-mono text-text bg-surface/50 px-2 py-1 rounded">{emergencyContact.number}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <Link
          to="view-profile"
          className="flex-1 glass-cta px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-lg hover:scale-[1.02] transition-transform"
        >
          <FaEye /> View Full Profile
        </Link>
        
        {!emergencyContact?.name && (
          <Link
            to="edit-profile"
            className="flex-1 glass border border-dashed border-primary/30 text-primary rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium hover:bg-primary/5 transition-colors"
          >
            <FaEdit /> Add Emergency Contact
          </Link>
        )}
      </div>
    </div>
  );
};

export default UserHealthProfileBlock;
