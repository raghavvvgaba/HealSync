import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { FaUserCircle, FaFileMedicalAlt } from 'react-icons/fa';
import { GiBodyHeight } from 'react-icons/gi';
import { MdBloodtype, MdSick } from 'react-icons/md';
import { FaArrowRight } from 'react-icons/fa';
import { getUserProfile } from '../utils/firestoreService';
import { useAuth } from '../context/authContext';

const ProfileBlock = () => {
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
      <div className="relative p-4 shadow text-text border-2 border-surface flex flex-col gap-6 rounded-xl">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!profileData || !profileData.basic) {
    return (
      <div className="relative p-4 shadow text-text border-2 border-surface flex flex-col gap-6 rounded-xl">
        <p className="text-gray-500">Profile data not available</p>
      </div>
    );
  }

  const { basic } = profileData;

  return (
    <div className="relative p-4 shadow text-text border-2 border-surface flex flex-col gap-6 rounded-xl group">
      {/* Semi-transparent background layer */}
      <div className="absolute inset-0 bg-surface opacity-100 group-hover:opacity-60 transition-opacity duration-300 rounded-xl pointer-events-none z-0"></div>

      {/* Content layer */}
      <div className="relative z-10">
        {/* Header */}
        <div className='flex'>
          <div className="flex items-center gap-3 dark:text-gray-300">
            <FaUserCircle size={30} className="text-primary" />
            <div className='flex items-stretch'>
              <div>
                <h2 className="text-lg font-semibold">{basic.fullName}</h2>
                <p className="text-sm text-gray-400">{basic.fullName}</p>
              </div>
              <div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          {/* Height */}
          <div className="bg-gray-200 dark:bg-slate-800 flex flex-wrap border border-gray-600 p-2 rounded-md items-start gap-2 sm:gap-4 dark:text-gray-300 font-medium mt-6 hover:bg-surface dark:hover:bg-surface">
            <div className="flex items-center gap-2">
              <GiBodyHeight className="text-accent translate-y-3" />
              <h4 className="min-w-[100px] translate-y-3">Height</h4>
            </div>
            <div className="bg-surface rounded-xl p-2 shadow text-text border-2 border-accent max-w-full">
              {basic.height?.value} {basic.height?.unit || 'cm'}
            </div>
          </div>

          {/* Weight */}
          <div className="bg-gray-200 dark:bg-slate-800 flex flex-wrap border border-gray-600 p-2 rounded-md items-start gap-2 sm:gap-4 dark:text-gray-300 font-medium hover:bg-surface dark:hover:bg-surface">
            <div className="flex items-center gap-2">
              <MdSick className="text-accent translate-y-3" />
              <h4 className="min-w-[100px] translate-y-3">Weight</h4>
            </div>
            <div className="bg-surface rounded-xl p-2 shadow text-text border-2 border-accent max-w-full">
              {basic.weight?.value} {basic.weight?.unit || 'kg'}
            </div>
          </div>

          {/* Blood Group */}
          <div className="bg-gray-200 dark:bg-slate-800 flex flex-wrap border border-gray-600 p-2 rounded-md items-start gap-2 sm:gap-4 dark:text-gray-300 font-medium hover:bg-surface dark:hover:bg-surface">
            <div className="flex items-center gap-2">
              <MdBloodtype className="text-accent translate-y-3" />
              <h4 className="min-w-[100px] translate-y-3">Blood Group</h4>
            </div>
            <div className="bg-surface rounded-xl p-2 shadow text-text border-2 border-accent max-w-full">
              {basic.bloodGroup || 'Not specified'}
            </div>
          </div>

          {/* Gender */}
          <div className="bg-gray-200 dark:bg-slate-800 flex flex-wrap border border-gray-600 p-2 rounded-md items-start gap-2 sm:gap-4 dark:text-gray-300 font-medium hover:bg-surface dark:hover:bg-surface">
            <div className="flex items-center gap-2">
              <FaUserCircle className="text-accent translate-y-3" />
              <h4 className="min-w-[100px] translate-y-3">Gender</h4>
            </div>
            <div className="bg-surface rounded-xl p-2 shadow text-text border-2 border-accent max-w-full">
              {basic.gender || 'Not specified'}
            </div>
          </div>

          {/* Date of Birth */}
          <div className="bg-gray-200 dark:bg-slate-800 flex flex-wrap border border-gray-600 p-2 rounded-md items-start gap-2 sm:gap-4 dark:text-gray-300 font-medium hover:bg-surface dark:hover:bg-surface">
            <div className="flex items-start gap-2">
              <FaFileMedicalAlt className="text-accent mt-1 translate-y-3" />
              <h4 className="min-w-[100px] translate-y-3">Date of Birth</h4>
            </div>
            <div className="bg-surface rounded-xl p-2 shadow text-text border-2 border-accent max-w-full">
              {basic.dob ? new Date(basic.dob).toLocaleDateString() : 'Not specified'}
            </div>
          </div>
        </div>
        <button className='text-sm md:text-base px-4 py-2 rounded-xl bg-primary dark:bg-primary text-white hover:bg-accent hover:scale-105 transition-all flex gap-2 group mt-5 shadow-lg'>
          <FaArrowRight className='translate-y-1 group-hover:animate-pulse transition-all duration-500' />
          <Link to='edit-profile' className='text-white dark:text-white'>Edit Profile</Link>
        </button>
        <button className='text-sm md:text-base px-4 py-2 rounded-xl bg-accent dark:bg-accent text-white hover:bg-primary hover:scale-105 transition-all flex gap-2 group mt-2 shadow-lg'>
          <FaArrowRight className='translate-y-1 group-hover:animate-pulse transition-all duration-500' />
          <Link to='view-profile' className='text-white dark:text-white'>View Full Profile</Link>
        </button>
      </div>
    </div>


  );
};

export default ProfileBlock;
