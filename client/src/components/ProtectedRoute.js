import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './common/LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner fullScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    const dashboardMap = { applicant: '/dashboard', employer: '/employer/dashboard', admin: '/admin/dashboard' };
    return <Navigate to={dashboardMap[user?.role] || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;
