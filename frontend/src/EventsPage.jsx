import React, { useState, useEffect, useContext } from 'react';
import api from './api';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export default function EventsPage() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        let res;
        if (user?.role === 'organizer') {
          // Fetch organizer's events only
          res = await api.get('/users/events', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setEvents(res.data); // Assuming backend returns array directly
        } else {
          // Fetch all approved events for other roles
          res = await api.get('/events');
          setEvents(res.data);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch events');
        setLoading(false);
      }
    }
    fetchEvents();
  }, [user, token]);

  // Filter events by title or location
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', maxWidth: 1200, margin: 'auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        {user?.role === 'organizer' ? 'My Events' : 'Events'}
      </h1>

      <input
        type="text"
        placeholder="Search events by name or location..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          padding: '0.75rem',
          fontSize: '1rem',
          borderRadius: '8px',
          border: '1px solid #ccc',
          marginBottom: '1.5rem',
        }}
      />

      {loading && <p>Loading events...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
          gap: '1.5rem',
        }}
      >
        {filteredEvents.length === 0 && !loading && <p>No events found.</p>}

        {filteredEvents.map(event => (
          <div
            key={event._id}
            style={{
              backgroundColor: '#f0f0f0',
              padding: '1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              textAlign: 'center',
              position: 'relative',
            }}
            onClick={() => {
              if (
                user?.role === 'organizer' &&
                (event.organizer === user.id || event.organizer === user._id)
              ) {
                navigate(`/edit-event/${event._id}`);
              } else {
                navigate(`/events/${event._id}`);
              }
            }}
          >
            <h3>{event.title}</h3>
            <p>{new Date(event.date).toLocaleDateString()}</p>
            <p>{event.location}</p>
            <p>Price: ${event.ticketPrice}</p>
            <p>Remaining Tickets: {event.remainingTickets}</p>
            {user?.role === 'organizer' && (
              <p>
                <strong>Status:</strong> {event.status}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
