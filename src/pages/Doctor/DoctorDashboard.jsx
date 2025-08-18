import React from 'react';
import DoctorIdDisplay from '../../components/DoctorIdDisplay';
import SharedProfilesList from '../../components/SharedProfilesList';

function DoctorDashboard() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary dark:text-secondary mb-2">
            Doctor Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your practice and view shared patient records
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Doctor ID Section */}
          <div className="lg:col-span-1">
            <DoctorIdDisplay />
          </div>
          
          {/* Quick Stats Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Quick Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="text-blue-800 dark:text-blue-200 text-sm font-medium">Total Shared Profiles</div>
                  <div className="text-blue-900 dark:text-blue-100 text-2xl font-bold">-</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="text-green-800 dark:text-green-200 text-sm font-medium">Active Shares</div>
                  <div className="text-green-900 dark:text-green-100 text-2xl font-bold">-</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="text-purple-800 dark:text-purple-200 text-sm font-medium">Recent Shares</div>
                  <div className="text-purple-900 dark:text-purple-100 text-2xl font-bold">-</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Shared Profiles Section */}
        <div className="mb-8">
          <SharedProfilesList />
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;