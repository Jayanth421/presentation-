import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const getUser = () => {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
};

export default function TopBar() {
  const navigate = useNavigate();
  const user = getUser();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="topbar">
      <div className="brand">PPT Management</div>
      <div className="navlinks">
        <Link to="/subjects">Subjects</Link>
        <Link to="/classes">Classes</Link>
        <Link to="/upload-ppt">Upload</Link>
      </div>
      <div className="user">
        <span>{user?.name}</span>
        <span className="role">{user?.role}</span>
        <button className="btn" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
