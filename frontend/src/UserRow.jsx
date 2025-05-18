// src/UserRow.jsx
import React, { useState, useContext } from 'react';
import api from './api';
import { AuthContext } from './AuthContext';
import UpdateUserRoleModal from './UpdateUserRoleModal';

export default function UserRow({ user, refreshUsers }) {
  const { token } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [errorDelete, setErrorDelete] = useState('');

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete user ${user.name}?`)) return;
    setLoadingDelete(true);
    setErrorDelete('');
    try {
      await api.delete(`/users/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refreshUsers();
    } catch (err) {
      setErrorDelete('Failed to delete user');
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <>
      <tr>
        <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{user.name}</td>
        <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{user.email}</td>
        <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{user.role}</td>
        <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>
          <button onClick={() => setModalOpen(true)} style={{ marginRight: 8 }}>
            Update Role
          </button>
          <button onClick={handleDelete} disabled={loadingDelete}>
            {loadingDelete ? 'Deleting...' : 'Delete'}
          </button>
          {errorDelete && <p style={{ color: 'red' }}>{errorDelete}</p>}
        </td>
      </tr>

      {modalOpen && (
        <UpdateUserRoleModal
          user={user}
          closeModal={() => setModalOpen(false)}
          refreshUsers={refreshUsers}
        />
      )}
    </>
  );
}
