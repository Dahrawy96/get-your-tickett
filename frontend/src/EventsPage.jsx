import React, { useState, useEffect } from 'react';
import api from './api';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await api.get('/events');
        setEvents(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load events');
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: 'auto' }}>
      <h1>All Events</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
        gap: '1rem',
      }}>
        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          events.map(event => (
            <div key={event._id} style={{
              backgroundColor: '#fff',
              color: '#000',
              borderRadius: 8,
              padding: 16,
              boxShadow: '0 0 8px rgba(77, 5, 84, 0.2)',
              cursor: 'pointer',
              transition: 'transform 0.2s',
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
          ))
        )}
      </div>
    </div>
  );
}
