import React, { useState, useEffect, useContext } from 'react';
import api from './api';
import { AuthContext } from './AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import EventAnalyticsModal from './EventAnalyticsModal'; // Import the modal component
import './EditEvent.css';


export default function EditEvent() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);

  // Fetch the event once on mount
  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data);
        setLoading(false);
      } catch (err) {
        setMessage('Failed to load event data');
        setLoading(false);
      }
    }
    if (id) fetchEvent();
  }, [id]);

  // Handle field changes - only for editable fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent(prev => ({
      ...prev,
      [name]: name === 'totalTickets' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await api.put(`/events/${id}`, event, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage('Event updated successfully!');
      setTimeout(() => navigate('/events'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update event.');
    }
  };

  // Fetch analytics for this event and show modal
  const handleViewAnalytics = async () => {
    try {
      const res = await api.get('/users/events/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const currentEventAnalytics = res.data.analytics.find(a => a.eventId === id);
      setAnalyticsData(currentEventAnalytics);
      setShowAnalytics(true);
    } catch (err) {
      setMessage('Failed to load analytics.');
    }
  };

  // New: Delete event handler
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await api.delete(`/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Event deleted successfully!');
      navigate('/events');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to delete event.');
    }
  };

  if (loading) return <p>Loading event data...</p>;
  if (!event) return <p>No event found.</p>;

  return (
    <>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto' }}>
        <h2>Edit Event</h2>

        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={event.date ? event.date.slice(0, 10) : ''}
          onChange={handleChange}
          required
        />

        <label>Location:</label>
        <input
          type="text"
          name="location"
          value={event.location || ''}
          onChange={handleChange}
          required
        />

        <label>Total Tickets:</label>
        <input
          type="number"
          name="totalTickets"
          value={event.totalTickets || ''}
          onChange={handleChange}
          min={1}
          required
        />

        {/* Non-editable fields shown for clarity, but disabled */}
        <label>Title:</label>
        <input type="text" value={event.title || ''} disabled />

        <label>Description:</label>
        <textarea value={event.description || ''} disabled />

        <label>Category:</label>
        <input type="text" value={event.category || ''} disabled />

        <label>Ticket Price:</label>
        <input type="number" value={event.ticketPrice || ''} disabled />

        <button type="submit" style={{ marginTop: 20 }}>
          Update Event
        </button>

        <button
          type="button"
          onClick={handleViewAnalytics}
          style={{
            marginTop: 20,
            marginLeft: 10,
            backgroundColor: '#4a148c',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          View Analytics
        </button>

        {/* DELETE BUTTON ADDED */}
        <button
          type="button"
          onClick={handleDelete}
          style={{
            marginTop: 20,
            marginLeft: 10,
            backgroundColor: '#d32f2f',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Delete Event
        </button>

        {message && <p style={{ marginTop: 10 }}>{message}</p>}
      </form>

      {showAnalytics && (
        <EventAnalyticsModal
          data={analyticsData}
          onClose={() => setShowAnalytics(false)}
        />
      )}
    </>
  );
}


