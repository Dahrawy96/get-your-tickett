import React, { useState, useEffect, useContext } from 'react';
import api from './api';
import { AuthContext } from './AuthContext';
import Navbar from './NavBar';

export default function AdminEventsPage() {
  const { token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/events/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch (err) {
      setError('Failed to fetch events');
    }
    setLoading(false);
  };

  const handleStatusChange = async (eventId, status) => {
    setMessage('');
    try {
      await api.patch(
        `/${eventId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(`Event ${status}`);
      fetchEvents(); // Refresh events list after update
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <p>Loading events...</p>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <p style={{ color: 'red' }}>{error}</p>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: 'auto', padding: '2rem' }}>
        <h2>Admin Events Management</h2>

        {message && <p style={{ color: 'green' }}>{message}</p>}

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '8px' }}>Title</th>
              <th style={{ padding: '8px' }}>Date</th>
              <th style={{ padding: '8px' }}>Location</th>
              <th style={{ padding: '8px' }}>Status</th>
              <th style={{ padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{event.title}</td>
                <td style={{ padding: '8px' }}>{new Date(event.date).toLocaleDateString()}</td>
                <td style={{ padding: '8px' }}>{event.location}</td>
                <td style={{ padding: '8px' }}>{event.status}</td>
                <td style={{ padding: '8px' }}>
                  {event.status !== 'approved' && (
                    <button
                      style={{ marginRight: '8px' }}
                      onClick={() => handleStatusChange(event._id, 'approved')}
                    >
                      Approve
                    </button>
                  )}
                  {event.status !== 'declined' && (
                    <button onClick={() => handleStatusChange(event._id, 'declined')}>
                      Decline
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
