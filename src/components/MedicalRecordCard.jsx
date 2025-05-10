import React from 'react';
import { FaFilePdf, FaImage } from 'react-icons/fa';
import { MdLocalHospital, MdMedication } from 'react-icons/md';

const MedicalRecordCard = ({ record }) => {
    const { diagnosis, medicines, fileName, fileType, fileUrl } = record;

    return (
        <div className="bg-surface rounded-xl p-4 shadow text-text border border-gray-600/20">
            <div className="mb-2 flex items-center gap-2">
                <MdLocalHospital className="text-accent" />
                <span className="font-semibold">Diagnosis:</span>
                <span>{diagnosis}</span>
            </div>

            <div className="mb-2 flex items-start gap-2">
                <MdMedication className="text-accent mt-1" />
                <div>
                    <span className="font-semibold">Medicines:</span>
                    <ul className="list-disc ml-5 text-sm">
                        {medicines.map((med, idx) => (
                            <li key={idx}>{med}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
                {fileType === 'pdf' ? (
                    <FaFilePdf className="text-red-500" />
                ) : (
                    <FaImage className="text-blue-400" />
                )}
                <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline text-sm"
                >
                    {fileName}
                </a>
            </div>
        </div>
    );
};

export default MedicalRecordCard;
