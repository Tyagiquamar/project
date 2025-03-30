import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelection: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      // Navigate to the corresponding page based on selected role
      if (selectedRole === 'Student') {
        navigate('/student');
      } else if (selectedRole === 'Teacher') {
        navigate('/teacher');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA]">
      {/* Interview Poll Header */}
      <div className="bg-[#7765DA] text-white py-2 px-4 rounded-full text-center mb-8 flex items-center">
        <span className="ml-2 text-xl">⭐</span> {/* Adding a star icon */}
        <span className="text-xl font-semibold">Interview Poll</span>
      </div>

      {/* Main content area with flex layout */}
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-[#1E1E1E] mb-6 text-center">
          Welcome to the Live Polling System
        </h1>
        <p className="text-center text-[#6E6E6E] mb-8">
          Please select the role that best describes you to begin using the live polling system
        </p>

        {/* Flex layout for Student and Teacher role options */}
        <div className="flex justify-between mb-6">
          <div
            onClick={() => handleRoleSelect('Student')}
            className={`p-6 border rounded-xl cursor-pointer hover:bg-gray-50 transition ${
              selectedRole === 'Student' ? 'border-blue-500 bg-blue-50' : 'border-[#E5E7EB]'
            } w-full mr-2`}
          >
            <h3 className="text-lg font-semibold text-[#1E1E1E]">I’m a Student</h3>
            <p className="text-[#6E6E6E] text-sm mt-2">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </p>
          </div>

          <div
            onClick={() => handleRoleSelect('Teacher')}
            className={`p-6 border rounded-xl cursor-pointer hover:bg-gray-50 transition ${
              selectedRole === 'Teacher' ? 'border-blue-500 bg-blue-50' : 'border-[#E5E7EB]'
            } w-full ml-2`}
          >
            <h3 className="text-lg font-semibold text-[#1E1E1E]">I’m a Teacher</h3>
            <p className="text-[#6E6E6E] text-sm mt-2">
              Submit answers and view live poll results in real-time.
            </p>
          </div>
        </div>

        {/* Continue button placed below */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className="w-full max-w-xs bg-blue-500 text-white py-3 rounded-xl mt-6 hover:bg-blue-600 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
