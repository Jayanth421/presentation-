import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const { data } = await api.post('/auth/google', {
        idToken: credentialResponse.credential,
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'Admin') navigate('/admin/dashboard');
      else if (data.user.role === 'Faculty') navigate('/faculty/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>College PPT Management</h1>
        <p>Login with your college Google account</p>
        <GoogleLogin onSuccess={handleSuccess} onError={() => alert('Login failed')} />
      </div>
    </div>
  );
}
