import React from 'react';
import { FaUserCircle, FaFileMedicalAlt } from 'react-icons/fa';
import { GiBodyHeight } from 'react-icons/gi';
import { MdBloodtype, MdSick } from 'react-icons/md';

const ProfileBlock = ({ user }) => {
  const { name, height, bloodGroup, diseases } = user;

  return (
    <div className="bg-surface w-full p-4 shadow text-text border border-gray-600/20 flex flex-col gap-6 rounded-xl">
  {/* Header */}
  <div className="flex items-center gap-3 dark:text-gray-300">
    <FaUserCircle size={30} className="text-primary" />
    <div>
      <h2 className="text-lg font-semibold">{name}</h2>
      <p className="text-sm text-gray-400">Patient Profile</p>
    </div>
  </div>

  {/* Height */}
  <div className="flex flex-wrap items-start gap-2 sm:gap-4 dark:text-gray-300 font-medium">
    <div className="flex items-center gap-2">
      <GiBodyHeight className="text-accent" />
      <h4 className="min-w-[100px]">Height</h4>
    </div>
    <div className="bg-surface rounded-xl p-2 shadow text-text border-2 border-accent max-w-full">
      {height} cm
    </div>
  </div>

  {/* Blood Group */}
  <div className="flex flex-wrap items-start gap-2 sm:gap-4 dark:text-gray-300 font-medium">
    <div className="flex items-center gap-2">
      <MdBloodtype className="text-accent" />
      <h4 className="min-w-[100px]">Blood Group</h4>
    </div>
    <div className="bg-surface rounded-xl p-2 shadow text-text border-2 border-accent max-w-full">
      {bloodGroup}
    </div>
  </div>

  {/* Diseases */}
  {/* Diseases */}
<div className="flex flex-wrap items-start gap-2 sm:gap-4 dark:text-gray-300 font-medium">
  <div className="flex items-start gap-2">
    <FaFileMedicalAlt className="text-accent mt-1" />
    <h4 className="min-w-[100px]">Diseases</h4>
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

  );
};

export default ProfileBlock;
