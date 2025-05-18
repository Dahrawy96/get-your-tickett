import React, { useState, useEffect, useContext } from 'react';
import Navbar from './NavBar';
import api from './api';  // Axios instance
import ticketphoto from './assets/ticketphoto.jpeg';  // Your background image
import Footer from './Footer';  // Import Footer here
import { AuthContext } from './AuthContext';

export default function WelcomePage() {
  const { user, token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        let res;

        if (user?.role === 'admin') {
          // Admin sees all events with status
          res = await api.get('/events/all', {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else if (user?.role === 'organizer') {
          // Organizer sees their own events with status
          res = await api.get('/users/events', {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          // Normal users/public see only approved events, no status shown
          res = await api.get('/events');
        }
        setEvents(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch events');
        setLoading(false);
      }
    }
    fetchEvents();
  }, [user, token]);

  // Filter events by title or location based on search term
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
            <div
              key={event._id}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: '#ffffff',
                borderRadius: '8px',
                padding: '1rem',
                boxShadow: 'rgba(0,0,0,0.3)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                textAlign: 'center',
              }}
              onClick={() => {
                if (user?.role === 'organizer' ) {
                  window.location.href = `/edit-event/${event._id}`;
                } else if(user?.role === 'admin') {
                  window.location.href = `/events`;
                } else {
                window.location.href =`/events/${event._id}`;
                }
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <h3>{event.title}</h3>
              <p>{new Date(event.date).toLocaleDateString()}</p>
              <p>{event.location}</p>
              <p>Price: ${event.ticketPrice}</p>
              <p>Remaining Tickets: {event.remainingTickets}</p>
              {(user?.role === 'organizer' || user?.role === 'admin') && (
                <p><strong>Status:</strong> {event.status}</p>
              )}
            </div>
          ))}
        </div>

        <Footer />
      </div>
    </div>
  );
}
