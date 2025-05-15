import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';            // Your axios instance with baseURL set correctly
import ticketphoto from './assets/ticketphoto.jpeg';  // Optional background image

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    setMessage('Logging in...');
    try {
      const response = await api.post('/login', formData);

      // Backend sends success response with token and user info
      if (response.status === 200) {
        setMessage('Login successful! Redirecting...');
        
        // Optionally save token for auth (localStorage/sessionStorage)
        localStorage.setItem('token', response.data.token);

        // Redirect to dashboard or welcome page
        navigate('/userprofile'); 
      }
    } catch (error) {
      // Show error from backend or fallback message
      setMessage(
        error.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${ticketphoto})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        padding: 20,
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          padding: 20,
          borderRadius: 8,
          width: '100%',
          maxWidth: 400,
          boxSizing: 'border-box',
        }}
      >
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
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
            style={{ width: '100%', marginBottom: 20, padding: 8 }}
          />
          <button type="submit" style={{ padding: '10px 20px', fontWeight: 'bold' }}>
            Log In
          </button>
        </form>

        {message && <p style={{ marginTop: 20 }}>{message}</p>}
      </div>
    </div>
  );
}
