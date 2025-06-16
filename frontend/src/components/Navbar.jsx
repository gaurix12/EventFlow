//navbar for all pages

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../pages/UserContext';

function Navbar() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
    setUser(null);
    navigate('/login');
  };

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/events">Events</Link>
      {user ? (
        <>
          {user.role === 'admin' ? (
            <Link to="/admin">Admin Panel</Link>
          ) : (
            <Link to="/dashboard">Dashboard</Link>
          )}
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
