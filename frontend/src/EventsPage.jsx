import React, { useEffect, useState, useContext } from 'react';
import api from './api';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export default function EventsPage() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    async function fetchEvents() {
      try {
        let res;
        if (user?.role === 'admin') {
          // Admin fetches all events
          res = await api.get('/events/all', {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else if (user?.role === 'organizer') {
          // Organizer fetches only their events
          res = await api.get('/users/events', {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          // Regular users see only approved events
          res = await api.get('/events');
        }

        setEvents(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load events.');
        setLoading(false);
      }
    }
    fetchEvents();
  }, [user, token]);

  const updateStatus = async (eventId, newStatus) => {
    try {
      await api.patch(
        `/events/${eventId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActionMessage(`Event ${newStatus} successfully.`);
      setEvents(events.map(ev => (ev._id === eventId ? { ...ev, status: newStatus } : ev)));
    } catch {
      setActionMessage('Failed to update status.');
    }
  };

  const deleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await api.delete(`/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActionMessage('Event deleted successfully.');
      setEvents(events.filter(ev => ev._id !== eventId));
    } catch {
      setActionMessage('Failed to delete event.');
    }
  };

  if (loading) return <p>Loading events...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
      <h1>Events Management</h1>
      {actionMessage && <p>{actionMessage}</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th>Title</th>
            <th>Date</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center' }}>No events found.</td>
            </tr>
          )}
          {events.map(event => (
            <tr key={event._id} style={{ borderBottom: '1px solid #eee' }}>
              <td>{event.title}</td>
              <td>{new Date(event.date).toLocaleDateString()}</td>
              <td>{event.location}</td>
              <td>{event.status || 'N/A'}</td>
              <td>
                {(user?.role === 'admin' && event.status === 'pending') && (
                  <>
                    <button onClick={() => updateStatus(event._id, 'approved')} style={{ marginRight: 5 }}>
                      Approve
                    </button>
                    <button onClick={() => updateStatus(event._id, 'declined')} style={{ marginRight: 5 }}>
                      Reject
                    </button>
                  </>
                )}

                {(user?.role === 'organizer' || user?.role === 'admin') && (
                  <>
                    <button
                      onClick={() => navigate(`/edit-event/${event._id}`)}
                      style={{ marginRight: 5 }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteEvent(event._id)}
                      style={{ backgroundColor: 'red', color: 'white' }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
