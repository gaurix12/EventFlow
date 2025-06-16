//for home page

import React from "react";
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to EventFlow</h1>
      <p className="subtitle">Your one-stop platform to create, manage, and explore exciting events!</p>

      <div className="nav-buttons">
        <Link to="/login"><button>Login</button></Link>
        <Link to="/register"><button>Register</button></Link>
        <Link to="/events"><button>View Events</button></Link>
      </div>

      <section className="features-section">
        <h2>Why Use EventFlow?</h2>
        <ul className="features-list">
          <li>🔔 Get timely notifications for upcoming events</li>
          <li>📅 Seamless event creation and registration</li>
          <li>👥 Manage attendees and registrations easily</li>
          <li>📍 View event details like location, time, and capacity</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>For Organizers & Students</h2>
        <p>
          Whether you're organizing a tech fest, seminar, workshop, or any campus event —
          EventFlow makes it easy to keep everything in one place.
        </p>
        <p>
          Students can register with just a click and stay updated. Organizers can monitor attendance
          and communicate effectively.
        </p>
      </section>

      <section className="cta-section">
        <h2>Get Started Today!</h2>
        <p>Sign up or login to explore events or create your own.</p>
        <div className="cta-buttons">
          <Link to="/register"><button>Join Now</button></Link>
          <Link to="/events"><button>Browse Events</button></Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
