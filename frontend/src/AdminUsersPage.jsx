// src/AdminUsersPage.jsx
import React, { useEffect, useState, useContext } from 'react';
import api from './api';
import { AuthContext } from './AuthContext';
import UserRow from './UserRow';

export default function AdminUsersPage() {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await api.get('/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [token]);

  // Refresh users list (pass to UserRow to call after update/delete)
  const refreshUsers = () => {
    setLoading(true);
    api.get('/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUsers(res.data))
      .catch(() => setError('Failed to fetch users'))
      .finally(() => setLoading(false));
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: '2rem' }}>
      <h2>Users Management</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Name</th>
            <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Email</th>
            <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Role</th>
            <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <UserRow key={user._id} user={user} refreshUsers={refreshUsers} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
