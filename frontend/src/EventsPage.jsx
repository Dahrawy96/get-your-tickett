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

      <table className="table">
  <thead>
    <tr>
      <th className="th">Title</th>
      <th className="th">Date</th>
      <th className="th">Location</th>
      <th className="th">Status</th>
      <th className="th">Actions</th>
    </tr>
  </thead>
  <tbody>
  {events.map(event => (
    <tr key={event._id} className="tr-row">
      <td className="td" data-label="Title"><span>{event.title}</span></td>
      <td className="td" data-label="Date"><span>{new Date(event.date).toLocaleDateString()}</span></td>
      <td className="td" data-label="Location"><span>{event.location}</span></td>
      <td className={`td status status-${event.status}`} data-label="Status"><span>{event.status || 'N/A'}</span></td>
      <td className="buttons-cell" data-label="Actions">
        <button className="button button-edit" onClick={() => navigate(`/edit-event/${event._id}`)}>Edit</button>
        <button className="button button-delete" onClick={() => deleteEvent(event._id)}>Delete</button>
      </td>
    </tr>
  ))}
</tbody>

</table>

    </div>
  );
}
