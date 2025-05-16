import React, { useState, useEffect, useContext } from 'react';
import api from './api';
import { AuthContext } from './AuthContext';
import Navbar from './NavBar';
import './MyBookings.css'; // If you use a separate CSS file

export default function MyBookings() {
  const { token } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  // Fetch all bookings for the user
  async function fetchBookings() {
  setLoading(true);
  setError('');
  try {
    const res = await api.get('/users/bookings', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("Fetched bookings data:", res.data); // Log the response data here
    setBookings(res.data.bookings);  // Make sure this is an array of bookings
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to load bookings.');
  } finally {
    setLoading(false);
  }
}


  // Handle cancel booking
  async function cancelBooking(id) {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.delete(`/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Booking cancelled successfully.');
      fetchBookings();  // Re-fetch bookings after cancellation
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to cancel booking.');
    }
  }

  // Filter bookings based on the search term
  const filteredBookings = bookings.filter(booking =>
    booking.event?.title.toLowerCase().includes(searchTerm.toLowerCase())  // Filter by event title
  );

  return (
    <>
      <Navbar />
      <div className="my-bookings-container">
        <h1 className="my-bookings-heading">My Bookings</h1>
        {/* Search Bar for filtering bookings */}
        <input
          type="text"
          placeholder="Search bookings by event name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="booking-search"
          style={{ marginBottom: '1.5rem' }}
        />

        {/* Show loading text while fetching */}
        {loading && <p>Loading bookings...</p>}

        {/* Show error message if there is an error fetching bookings */}
        {error && <p className="error-text">{error}</p>}

        {/* Show success message after cancellation */}
        {message && <p className="message-text">{message}</p>}

        {/* Display bookings if available */}
        {!loading && !error && filteredBookings.length === 0 && (
          <p>No bookings found.</p>
        )}

        {/* List of bookings */}
        <ul className="booking-list">
  {filteredBookings.map(booking => (
    <li key={booking._id} className="booking-item">
      <div>
        <strong>{booking.event?.title || 'Unknown Event'}</strong><br />
        Quantity: {booking.quantity}<br />
        Total Price: ${booking.totalPrice}
      </div>

      <button
        className="cancel-button"
        onClick={() => cancelBooking(booking._id)}
      >
        Cancel Booking
      </button>
    </li>
  ))}
</ul>

      </div>
    </>
  );
}
