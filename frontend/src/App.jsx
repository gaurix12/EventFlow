import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginForm';
import RegisterPage from './pages/RegisterForm';
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import Dashboard from './pages/UserDashboard';
import AdminPanel from './pages/AdminPanel';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import { UserProvider, useUser } from './pages/UserContext';
import './styles/App.css';

const PrivateRoute = ({ element, role }) => {
  const { user } = useUser();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/events" />;
  return element;
};

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/admin" element={<PrivateRoute element={<AdminPanel />} role="admin" />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
