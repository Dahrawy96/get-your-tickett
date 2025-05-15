import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';              // Axios instance with baseURL
import ticketphoto from './assets/ticketphoto.jpeg';  // Background image

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
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
    setMessage('Submitting...');
    try {
      const response = await api.post('/register', formData);

      // Store JWT token in localStorage
      localStorage.setItem('token', response.data.token);

      setMessage('User created successfully!');
      navigate('/');  // Redirect to welcome page
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || error.message));
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

          <label>Role:</label><br />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{ width: '100%', marginBottom: 20, padding: 8 }}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="organizer">Organizer</option>
          </select>

          <button type="submit" style={{ padding: '10px 20px', fontWeight: 'bold' }}>
            Sign Up
          </button>
        </form>

        {message && <p style={{ marginTop: 20 }}>{message}</p>}
      </div>
    </div>
  );
}
