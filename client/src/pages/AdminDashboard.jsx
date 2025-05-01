import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

const AdminDash = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-image px-4">
      <LogoutButton />
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Portal</h1>

        <div className="space-y-4">
          <button
            onClick={() => handleNavigation("/admin/user-management")}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded"
          >
            User Management
          </button>

          <button
            onClick={() => handleNavigation("/admin/template-management")}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded"
          >
            Template Management
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDash;
