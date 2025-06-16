//for a single event page

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', phone: '' });
  const [role, setRole] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: ''
  });

  useEffect(() => {
    checkUserRole();
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:5000/event/${id}`).then(res => {
      setEvent(res.data);
      setEditData(res.data);
    });
  }, [id]);

  useEffect(() => {
    if (role === 'admin') {
      fetchRegistrations();
    }
    if (role === 'user') {
      checkRegistrationStatus();
    }
  }, [role]);

  const handleEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/event/${id}/edit`, editData, { withCredentials: true });
      alert("Event updated");
      setEvent(editData);
      setIsEditing(false);
    } catch (err) {
      alert("Edit failed");
    }
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;

    try {
      await axios.delete(`http://localhost:5000/event/${id}/delete`, { withCredentials: true });
      alert("Event deleted successfully");
      navigate('/events'); // Redirect to events list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete event");
    }
  };

  const checkUserRole = async () => {
    try {
      const res = await axios.get('http://localhost:5000/check-role', { withCredentials: true });
      setRole(res.data.role.toLowerCase());
    } catch {
      console.log('Error checking role');
    }
  };

  const fetchRegistrations = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/admin/event/${id}/registrations`, {
        withCredentials: true
      });
      setRegistrations(res.data.registrations);
    } catch {
      console.log('Error fetching registrations');
    }
  };

  const checkRegistrationStatus = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/event/${id}/is-registered`, {
        withCredentials: true
      });
      setIsRegistered(res.data.registered);
    } catch {
      console.log("Error checking registration status");
    }
  };

  const register = async () => {
    try {
      await axios.post(`http://localhost:5000/event/${id}/register-user`, form, { withCredentials: true });
      alert("Registered!");
      setForm({ username: '', email: '', phone: '' });
      setIsRegistered(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to register");
    }
  };

  const cancel = async () => {
    try {
      await axios.post(`http://localhost:5000/event/${id}/cancel`, {}, { withCredentials: true });
      alert("Cancelled registration");
      setIsRegistered(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel");
    }
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div className="event-details-container">
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Capacity:</strong> {event.registrations}/{event.capacity}</p>

      {role === 'user' && (
        !isRegistered ? (
          <div className="register-section">
            <h3>Register</h3>
            <input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
            <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            <button onClick={register}>Register</button>
          </div>
        ) : (
          <button className="cancel-btn" onClick={cancel}>Cancel Registration</button>
        )
      )}

      {role === 'admin' && (
        <>
          <div className="registration-list">
            <h3>Registrations</h3>
            {registrations.length === 0 ? (
              <p>No one has registered for this event yet.</p>
            ) : (
              <ul>
                {registrations.map((reg, index) => (
                  <li key={index}>
                    <strong>Name:</strong> {reg.name} | <strong>Email:</strong> {reg.email} | <strong>Phone:</strong> {reg.phone}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="admin-controls">
            <button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel Edit" : "Edit Event"}
            </button>
            <button onClick={handleDeleteEvent} style={{ marginLeft: '10px', color: 'red' }}>
              Delete Event
            </button>

            {isEditing && (
              <div className="edit-form">
                <input value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
                <textarea value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })}></textarea>
                <input value={editData.date} onChange={(e) => setEditData({ ...editData, date: e.target.value })} type="date" />
                <input value={editData.location} onChange={(e) => setEditData({ ...editData, location: e.target.value })} />
                <input value={editData.capacity} onChange={(e) => setEditData({ ...editData, capacity: e.target.value })} type="number" />
                <button onClick={handleEdit}>Save Changes</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default EventDetails;
