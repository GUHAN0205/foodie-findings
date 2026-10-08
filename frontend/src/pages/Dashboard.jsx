import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DonorDashboard from './dashboards/DonorDashboard';
import VolunteerDashboard from './dashboards/VolunteerDashboard';
import NGODashboard from './dashboards/NGODashboard';
import AdminDashboard from './dashboards/AdminDashboard';

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-[#e23744] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-[#64748b] mt-3">Loading dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=/dashboard" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {user?.role === 'DONOR' && <DonorDashboard />}
      {user?.role === 'VOLUNTEER' && <VolunteerDashboard />}
      {user?.role === 'NGO' && <NGODashboard />}
      {user?.role === 'ADMIN' && <AdminDashboard />}
    </div>
  );
};

export default Dashboard;
