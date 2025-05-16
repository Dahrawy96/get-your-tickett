import React, { useState, useEffect, useContext } from 'react';
import api from './api';
import { AuthContext } from './AuthContext';
import Navbar from './NavBar';
import './UserProfile.css';
import ticketphoto from './assets/ticketphoto.jpeg';

export default function UserProfile() {
  const { token, login } = useContext(AuthContext);

  // This holds the sidebar user info shown at all times
  const [sidebarData, setSidebarData] = useState({ name: '', email: '', role: '' });

  // This holds the editable form inputs, start empty
  const [formData, setFormData] = useState({ name: '', email: '', role: '' });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // On mount, fetch user profile and fill sidebar ONLY
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get('/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data.user;
        console.log(user)

        // Set sidebarData from backend immediately (shows current user info)
        setSidebarData({
          name: user.name || '',
          email: user.email || '',
          role: user.role || '',
        });

        // Leave formData empty initially so inputs are blank
        setFormData({ name: '', email: '', role: user.role || '' });

        setLoading(false);
      } catch (error) {
        setMessage('Failed to load profile.');
        setLoading(false);
      }
    }
    if (token) fetchProfile();
  }, [token]);

  // Handle input changes in form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // On update, send formData, then update sidebarData with response
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await api.put('/users/profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUser = res.data.user;

      // Update sidebar to reflect new info
      setSidebarData({
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });

      // Clear form inputs (optional) or keep as updated
      setFormData({ name: '', email: '', role: updatedUser.role });

      // Update context user info
      login(updatedUser, token);

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
        {/* Sidebar shows current user info */}
        <div className="profile-sidebar">
          <div className="profile-avatar">&#128100;</div>
          <h2 className="profile-name">{sidebarData.name }</h2>
          <p className="profile-role"><strong>Role:</strong> {sidebarData.role}</p>
          <p className="profile-email">{sidebarData.email}</p>
        </div>

        {/* Form is separate and initially empty */}
        <div className="profile-content">
          <h2>Edit Profile</h2>
          <form onSubmit={handleSubmit} className="profile-form">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={sidebarData.name || 'Enter your name'}
              required
            />
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={sidebarData.email || 'Enter your email'}
              required
            />
            <label>Role</label>
            <input
              type="text"
              value={sidebarData.role}
              disabled
            />
            <button type="submit">Update Profile</button>
          </form>
          {message && <p className="message-text">{message}</p>}
        </div>
      </div>
    </>
  );
}
