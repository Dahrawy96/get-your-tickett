import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import { AuthContext } from './AuthContext';
import './CreateEvent.css';


export default function CreateEvent() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Title: '',
    Description: '',
    Date: '',
    Location: '',
    Category: '',
    TicketPrice: '',
    TotalTickets: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.post('/events', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Event created successfully! Pending admin approval.');
      navigate('/'); // Or navigate('/my-events') if you have that route
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create event.');
    }
  };

  return (
    <div className="form-container">
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit} className="event-form">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key}>
            <label>{key.replace(/([A-Z])/g, ' $1')}:</label>
            <input
              type={key === 'date' ? 'date' : key.includes('Price') || key.includes('Tickets') ? 'number' : 'text'}
              name={key}
              value={value}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit">Submit</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
