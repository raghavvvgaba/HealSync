import React from 'react';
import { Link } from 'react-router';
import { FaUserCircle, FaFileMedicalAlt } from 'react-icons/fa';
import { GiBodyHeight } from 'react-icons/gi';
import { MdBloodtype, MdSick } from 'react-icons/md';
import { FaArrowRight } from 'react-icons/fa'

const ProfileBlock = ({ user }) => {
  const { firstName, lastName, height, bloodGroup, diseases } = user;

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
                <h2 className="text-lg font-semibold">{firstName}</h2>
                <p className="text-sm text-gray-400">{firstName + " " + lastName}</p>
              </div>
              <div>
                <button className='text-sm md:text-base px-4 py-2 rounded-xl bg-primary dark:bg-secondary text-text hover:scale-105 transition-all flex gap-2 group'>
                  <Link to=''
                  >Edit Profile</Link>
                  <FaArrowRight className='translate-y-1 group-hover:animate-pulse transition-all duration-500' />
                </button>
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
              {height} cm
            </div>
          </div>

          {/* Blood Group */}
          <div className="bg-gray-200 dark:bg-slate-800 flex flex-wrap border border-gray-600 p-2 rounded-md items-start gap-2 sm:gap-4 dark:text-gray-300 font-medium hover:bg-surface dark:hover:bg-surface">
            <div className="flex items-center gap-2">
              <MdBloodtype className="text-accent translate-y-3" />
              <h4 className="min-w-[100px] translate-y-3">Blood Group</h4>
            </div>
            <div className="bg-surface rounded-xl p-2 shadow text-text border-2 border-accent max-w-full">
              {bloodGroup}
            </div>
          </div>

          {/* Diseases */}
          <div className="bg-gray-200 dark:bg-slate-800 flex flex-wrap border border-gray-600 p-2 rounded-md items-start gap-2 sm:gap-4 dark:text-gray-300 font-medium hover:bg-surface dark:hover:bg-surface">
            <div className="flex items-start gap-2">
              <FaFileMedicalAlt className="text-accent mt-1 translate-y-3" />
              <h4 className="min-w-[100px] translate-y-3">Diseases</h4>
            </div>
            <div className="flex flex-wrap gap-2 bg-surface p-2 rounded-xl border-2 border-accent shadow w-full sm:w-auto">
              {diseases.length > 0 ? (
                diseases.map((disease, idx) => (
                  <span
                    key={idx}
                    className="bg-accent-20 border border-accent text-white text-sm px-3 py-1 rounded-full shadow-sm"
                  >
                    {disease}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-400">None</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>


  );
};

export default ProfileBlock;
