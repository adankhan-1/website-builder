import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

const AdminDash = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-image px-4 relative">
      <LogoutButton />
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Portal</h1>

        <div className="space-y-4">
          {/* User Management Dropdown */}
          <div className="relative group text-left">
            <button
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded"
            >
              User Management
            </button>
            <div className="absolute top-0 left-full bg-white shadow-lg rounded hidden group-hover:block z-10 min-w-max">
              <button
                onClick={() => handleNavigation("/admin/user-management")}
                className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
              >
                View Users
              </button>
              <button
                onClick={() => handleNavigation("/admin/user-management")}
                className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
              >
                Approve Users
              </button>
            </div>
          </div>

          {/* Template Management Dropdown */}
          <div className="relative group text-left">
            <button
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded"
            >
              Template Management
            </button>
            <div className="absolute top-0 left-full bg-white shadow-lg rounded hidden group-hover:block z-10 min-w-max">
              <button
                onClick={() => handleNavigation("/admin/view-templates")}
                className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
              >
                View Templates
              </button>
              <button
                onClick={() => handleNavigation("/admin/add-template")}
                className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
              >
                Add New Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDash;