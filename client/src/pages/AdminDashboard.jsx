import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

const FlipCard = ({ title, options }) => {
  const [flipped, setFlipped] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="w-full h-48 perspective">
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style preserve-3d ${
          flipped ? 'transform rotate-y-180' : ''
        }`}
      >
        {/* Front Side */}
        <div
          className="absolute w-full h-full backface-hidden bg-cyan-500 text-white font-semibold flex items-center justify-center rounded cursor-pointer text-xl"
          onClick={() => setFlipped(true)}
        >
          {title}
        </div>

        {/* Back Side */}
        <div className="absolute w-full h-full backface-hidden transform rotate-y-180 bg-white border border-cyan-500 rounded flex flex-col items-center justify-center space-y-2 p-4">
          {options.map((opt, index) => (
            <button
              key={index}
              onClick={() => navigate(opt.path)}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded"
            >
              {opt.label}
            </button>
          ))}
          <button
            onClick={() => setFlipped(false)}
            className="mt-2 text-sm text-cyan-600 hover:underline"
          >
            🔙 Back
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-image px-4 relative">
      <LogoutButton />
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Portal</h1>

        <div className="space-y-6">
          <FlipCard
            title="User Management"
            options={[
              { label: 'Approve New Users', path: '/admin/user-management/unapproved' },
              { label: 'View Users', path: '/admin/user-management/all' },
            ]}
          />
          <FlipCard
            title="Template Management"
            options={[
              { label: 'Add New Template', path: '/admin/add-template' },
              { label: 'View Templates', path: '/admin/view-templates' },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;