import React, { useState, useContext, useEffect } from 'react';
import api from './api';
import { AuthContext } from './AuthContext';
import Navbar from './NavBar';
import './UserProfile.css';
import ticketphoto from './assets/ticketphoto.jpeg';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const { user, token, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Prefill formData with user info on mount or when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await api.put('/users/profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUser = res.data.user;
      login(updatedUser, token); // Update context user info so Navbar and sidebar update
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <p className="loading-text">Loading profile...</p>
    </>
  );

  return (
    <>
      <Navbar />
      <div
        className="profile-page-container"
        style={{ backgroundImage: `url(${ticketphoto})` }}
      >
        {/* Sidebar shows current user info from context */}
        <div className="profile-sidebar">
          <div className="profile-avatar">&#128100;</div>
          <h2 className="profile-name">{user?.name || 'User'}</h2>
          <p className="profile-role"><strong>Role:</strong> {user?.role || 'N/A'}</p>
          <p className="profile-email">{user?.email || '(No email)'}</p>
        </div>

        {/* Profile content */}
        <div className="profile-content">
          <h2>Edit Profile</h2>
          <form onSubmit={handleSubmit} className="profile-form">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
            <label>Role</label>
            <input
              type="text"
              value={user?.role || 'N/A'}
              disabled
            />
            <button type="submit">Update Profile</button>
          </form>
          {message && <p className="message-text">{message}</p>}

          {/* My Bookings Button */}
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
           {user?.role === 'user' && (
         <button
          className="my-bookings-button"
          onClick={() => navigate('/my-bookings')}
          style={{
                padding: '12px 24px',
                fontSize: '1.1rem',
                fontWeight: '600',
               backgroundColor: '#6a1b9a',
               color: 'white',
               border: 'none',
               borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
    }}
      
    
    onMouseOver={e => e.currentTarget.style.backgroundColor = '#4a148c'}
    onMouseOut={e => e.currentTarget.style.backgroundColor = '#6a1b9a'}
  >
    My Bookings
  </button>
)}

          </div>
        </div>
      </div>
    </>
  );
}

