import React from 'react';
import { FaUserCircle, FaFileMedicalAlt } from 'react-icons/fa';
import { GiBodyHeight } from 'react-icons/gi';
import { MdBloodtype, MdSick } from 'react-icons/md';

const ProfileBlock = ({ user }) => {
  const { name, height, bloodGroup, diseases } = user;

  return (
    <div className="bg-surface text-text rounded-2xl p-6 shadow-md w-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <FaUserCircle size={40} className="text-primary" />
        <div>
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-sm text-gray-400">Patient Profile</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <GiBodyHeight size={20} className="text-accent" />
          <span className="font-medium">Height:</span>
          <span>{height} cm</span>
        </div>

        <div className="flex items-center gap-2">
          <MdBloodtype size={20} className="text-accent" />
          <span className="font-medium">Blood Group:</span>
          <span>{bloodGroup}</span>
        </div>

        <div className="flex items-start gap-2 col-span-2">
        <FaFileMedicalAlt size={20} className="text-accent mt-1" />
          <div>
            <span className="font-medium block">Diseases:</span>
            <ul className="list-disc ml-5 text-sm">
              {diseases.length > 0 ? (
                diseases.map((disease, idx) => <li key={idx}>{disease}</li>)
              ) : (
                <li>None</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBlock;
