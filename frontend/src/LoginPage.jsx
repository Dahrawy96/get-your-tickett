import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api'; // Axios instance with correct baseURL
import ticketphoto from './assets/ticketphoto.jpeg';
import { AuthContext } from './AuthContext';  // <-- Import AuthContext

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [forgotData, setForgotData] = useState({
    email: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [message, setMessage] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);  // <-- use login from AuthContext

  // Login input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Forgot password input handler
  const handleForgotChange = (e) => {
    const { name, value } = e.target;
    setForgotData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Login submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Logging in...');
    try {
      const response = await api.post('/login', formData);

      if (response.status === 200) {
        setMessage('Login successful! Redirecting...');
        // Use AuthContext login to save user info & token globally
        login(response.data.user, response.data.token);
        navigate('/userprofile');  // redirect after login
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  // Forgot password submit handler
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (forgotData.newPassword !== forgotData.confirmNewPassword) {
      setMessage("New passwords don't match.");
      return;
    }

    if (!forgotData.email || !forgotData.newPassword) {
      setMessage('Email and new password are required.');
      return;
    }

    try {
      const payload = {
        email: forgotData.email,
        newPassword: forgotData.newPassword,
      };
      await api.put('/forgetPassword', payload);

      setMessage('Password updated successfully! Please login.');
      setShowForgot(false);
      setForgotData({ email: '', newPassword: '', confirmNewPassword: '' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update password.');
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Background image */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
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
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1,
        }}
      />

      {/* Content */}
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
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 20,
            borderRadius: 8,
            width: '100%',
            maxWidth: 400,
          }}
        >
          {!showForgot ? (
            <>
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
                <button
                  type="submit"
                  style={{ padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Log In
                </button>
              </form>

              <p
                style={{
                  marginTop: 15,
                  cursor: 'pointer',
                  color: '#61dafb',
                  textDecoration: 'underline',
                }}
                onClick={() => {
                  setShowForgot(true);
                  setMessage('');
                }}
              >
                Forgot Password?
              </p>
            </>
          ) : (
            <>
              <h2>Reset Password</h2>
              <form onSubmit={handleForgotSubmit}>
                <label>Email:</label><br />
                <input
                  type="email"
                  name="email"
                  value={forgotData.email}
                  onChange={handleForgotChange}
                  required
                  style={{ width: '100%', marginBottom: 15, padding: 8 }}
                />
                <label>New Password:</label><br />
                <input
                  type="password"
                  name="newPassword"
                  value={forgotData.newPassword}
                  onChange={handleForgotChange}
                  required
                  style={{ width: '100%', marginBottom: 15, padding: 8 }}
                />
                <label>Confirm New Password:</label><br />
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={forgotData.confirmNewPassword}
                  onChange={handleForgotChange}
                  required
                  style={{ width: '100%', marginBottom: 20, padding: 8 }}
                />
                <button
                  type="submit"
                  style={{ padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Update Password
                </button>
              </form>

              <p
                style={{
                  marginTop: 15,
                  cursor: 'pointer',
                  color: '#61dafb',
                  textDecoration: 'underline',
                }}
                onClick={() => {
                  setShowForgot(false);
                  setMessage('');
                }}
              >
                Back to Login
              </p>
            </>
          )}

          {message && <p style={{ marginTop: 20 }}>{message}</p>}
        </div>
      </div>
    </div>
  );
}
