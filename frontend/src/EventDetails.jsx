import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from './api';
import { AuthContext } from './AuthContext';
import './EventDetails.css';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true);
        const res = await api.get(`/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        setMessage('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    try {
      const res = await api.post('/bookings', {
        eventId: id,
        ticketsRequested: quantity,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('Booking successful!');
      setTimeout(() => {
        navigate('/my-bookings');
      }, 1500); // wait a bit before redirecting
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed.');
    }
  };

  if (loading) return <p className="loading-text">Loading event details...</p>;

  return (
    <div className="event-details-container">
      <h2>{event.title}</h2>
      <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Price:</strong> ${event.ticketPrice}</p>
      <p><strong>Remaining Tickets:</strong> {event.remainingTickets}</p>

      {user?.role === 'user' && (
        <>
          {event.remainingTickets === 0 ? (
            <p className="sold-out-text">🚫 Sold Out!</p>
          ) : (
            <div className="booking-box">
              <label>Quantity:</label>
              <input
                type="number"
                min="1"
                max={event.remainingTickets}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
              <p><strong>Total Price:</strong> ${quantity * event.ticketPrice}</p>
              <button onClick={handleBooking} disabled={quantity > event.remainingTickets}>
                Book Now
              </button>
            </div>
          )}
        </>
      )}

      {message && <p className="message-text">{message}</p>}
    </div>
  );
}
