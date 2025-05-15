import React, { useState, useEffect } from 'react';
import Navbar from './NavBar';
import api from './api';  // Axios instance
import ticketphoto from './assets/ticketphoto.jpeg';  // Your background image
import Footer from './Footer';  // Import Footer here

export default function WelcomePage() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await api.get('/events');  // Adjust endpoint if needed
        setEvents(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch events');
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Filter events by name or location based on search
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Background image - fixed, fills viewport */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundImage: `url(${ticketphoto})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />

      {/* Black overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1,
        }}
      />

      {/* Page content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 1200,
          margin: 'auto',
          padding: '2rem',
          color: 'white',
          minHeight: '100vh',
          boxSizing: 'border-box',
        }}
      >
        <Navbar />

        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '1.5rem',
        }}>
          Welcome to TicketMaster
        </h1>

        <input
          type="text"
          placeholder="Search events by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            borderRadius: '8px',
            border: 'none',
            marginBottom: '1.5rem',
          }}
        />

        {loading && <p>Loading events...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
          gap: '1.5rem',
        }}>
          {filteredEvents.length === 0 && !loading && <p>No events found.</p>}

          {filteredEvents.map(event => (
            <div key={event._id} style={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: '#ffffff',
              borderRadius: '8px',
              padding: '1rem',
              boxShadow: 'rgba(0,0,0,0.3)',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              textAlign: 'center',
            }}
              onClick={() => window.location.href = `/events/${event._id}`}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <h3>{event.title}</h3>
              <p>{new Date(event.date).toLocaleDateString()}</p>
              <p>{event.location}</p>
              <p>Price: ${event.ticketPrice}</p>
              <p>Remaining Tickets: {event.remainingTickets}</p>
            </div>
          ))}
        </div>

        {/* Footer added here */}
        <Footer />
      </div>
    </div>
  );
}
