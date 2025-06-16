// for all events page

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
    checkAdminStatus();
  }, []);

  const fetchEvents = async () => {
    const res = await axios.get('http://localhost:5000/events', { withCredentials: true });
    setEvents(res.data);
  };

  const checkAdminStatus = async () => {
    try {
      const res = await axios.get('http://localhost:5000/check-role', { withCredentials: true });
      setIsAdmin(res.data.role.toLowerCase() === 'admin');
    } catch (err) {
      console.log('Error checking role');
    }
  };

  return (
    <div className="event-list-container">
      <h2>Events</h2>
      {isAdmin && (
        <>
        <button onClick={() => navigate('/admin')}>Add Event</button><br></br>
        </>
      )}
      <div className="event-grid">
        {events.map(event => (
          <div className="event-card" key={event.id}>
            <h3>{event.title}</h3>
            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Capacity:</strong> {event.capacity}</p>
            <p><strong>Registered:</strong> {event.registrations}</p>
            <button className="view-event-btn" onClick={() => navigate(`/event/${event.id}`)}>View Event</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
