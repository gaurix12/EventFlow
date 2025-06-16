//for dispalying in events page

import React from 'react';

function EventCard({ event }) {
  return (
    <li className="event-card">
      <h3>{event.title}</h3>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Capacity:</strong> {event.capacity}</p>
      <p><strong>Registered Users:</strong> {event.registrations}</p>
    </li>
  );
}

export default EventCard;
