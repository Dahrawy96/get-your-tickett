// src/UpdateUserRoleModal.jsx
import React, { useState, useContext } from 'react';
import api from './api';
import { AuthContext } from './AuthContext';

export default function UpdateUserRoleModal({ user, closeModal, refreshUsers }) {
  const { token } = useContext(AuthContext);
  const [newRole, setNewRole] = useState(user.role);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roles = ['user', 'organizer', 'admin'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.put(`/users/${user._id}`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refreshUsers();
      closeModal();
    } catch (err) {
      setError('Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}>
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px', width: 300 }}>
        <h3>Update Role for {user.name}</h3>

        <select value={newRole} onChange={(e) => setNewRole(e.target.value)} style={{ width: '100%', padding: '0.5rem' }}>
          {roles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
          {loading ? 'Updating...' : 'Update'}
        </button>
        <button type="button" onClick={closeModal} style={{ marginLeft: '1rem' }}>
          Cancel
        </button>
      </form>
    </div>
  );
}
