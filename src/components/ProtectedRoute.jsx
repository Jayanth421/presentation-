import React from 'react';
import { Navigate } from 'react-router-dom';

const getUser = () => {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
};

export default function ProtectedRoute({ roles, children }) {
  const token = localStorage.getItem('token');
  const user = getUser();
  if (!token || !user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
}
