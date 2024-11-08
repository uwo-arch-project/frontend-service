// src/pages/Dashboard.tsx
import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Welcome to Your Dashboard!</h2>
        <p className="text-xl">You are successfully logged in.</p>
      </div>
    </div>
  );
};

export default Dashboard;
