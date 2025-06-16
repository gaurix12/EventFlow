//for admin to add events

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const AdminPanel = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/admin/create-event", form, { withCredentials: true });
      alert('Event added successfully!');
      navigate('/events');
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating event');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Event</h2>
      <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
      <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
      <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
      <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
      <input type="number" placeholder="Capacity" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} required />
      <button type="submit">Create</button>
    </form>
  );
};

export default AdminPanel;
