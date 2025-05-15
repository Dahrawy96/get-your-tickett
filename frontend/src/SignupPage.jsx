import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';              // Axios instance with baseURL
import ticketphoto from './assets/ticketphoto.jpeg';  // Background image

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords don't match.");
      return;
    }

    try {
      const { confirmPassword, ...submitData } = formData; // exclude confirmPassword
      const response = await api.post('/register', submitData);

      localStorage.setItem('token', response.data.token);

      setMessage('User created successfully! Redirecting to login...');
      navigate('/login');  // Redirect to login page now
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Background image */}
      <div
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw',
          height: '100vh',
          backgroundImage: `url(${ticketphoto})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />

      {/* Black overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1,
        }}
      />

      {/* Form container */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          padding: 20,
          boxSizing: 'border-box',
          color: 'white',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            padding: 20,
            borderRadius: 8,
            width: '100%',
            maxWidth: 400,
          }}
        >
          <h2>Create Account</h2>

          <form onSubmit={handleSubmit}>
            <label>Name:</label><br />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: '100%', marginBottom: 15, padding: 8 }}
            />

            <label>Email:</label><br />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: '100%', marginBottom: 15, padding: 8 }}
            />

            <label>Password:</label><br />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ width: '100%', marginBottom: 15, padding: 8 }}
            />

            <label>Confirm Password:</label><br />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{ width: '100%', marginBottom: 15, padding: 8 }}
            />

            <label>Role:</label><br />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{ width: '100%', marginBottom: 20, padding: 8 }}
            >
              <option value="user">User</option>
              <option value="organizer">Organizer</option>
            </select>

            <button type="submit" style={{ padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer' }}>
              Sign Up
            </button>
          </form>

          {message && <p style={{ marginTop: 20 }}>{message}</p>}
        </div>
      </div>
    </div>
  );
}
