// for user to see their registered events

import React, { useState, useEffect } from "react";
import axios from 'axios';

function UserDashboard() {
  const [myEvents, setMyEvents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/dashboard', { withCredentials: true }).then(res => {
      setMyEvents(res.data);
    });
  }, []);

  return (
    <div>
      <h2>My Registered Events</h2>
      <ul>
        {myEvents.map((event, idx) => (
          <li key={idx}>{event.title} - {event.date} at {event.location}</li>
        ))}
      </ul>
    </div>
  );
}

export default UserDashboard;
