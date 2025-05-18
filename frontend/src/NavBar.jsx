import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');  // Redirect after logout
  };

  return (
    <nav style={{
      backgroundColor: '#222',
      color: 'white',
      padding: '1rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: 1200,
        margin: 'auto',
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>TicketMaster</Link>
        </div>

        <div
          onClick={toggleMenu}
          style={{
            display: 'none',
            flexDirection: 'column',
            cursor: 'pointer',
            gap: '5px',
          }}
          className="hamburger"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          role="button"
          tabIndex={0}
          onKeyDown={e => { if(e.key === 'Enter') toggleMenu(); }}
        >
          <div style={{ width: 25, height: 3, backgroundColor: 'white' }}></div>
          <div style={{ width: 25, height: 3, backgroundColor: 'white' }}></div>
          <div style={{ width: 25, height: 3, backgroundColor: 'white' }}></div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
          }}
          className="nav-links"
        >
          {/* Events link: admin goes to /admin/events, organizer and users to /events */}
          {user?.role === 'admin' ? (
            <Link to="/admin/events" style={{ color: 'white', textDecoration: 'none' }}>Events</Link>
          ) : (
            <Link to="/events" style={{ color: 'white', textDecoration: 'none' }}>Events</Link>
          )}

          {/* Create Event button only for organizer */}
          {user?.role === 'organizer' && (
            <Link to="/create-event" style={{ color: 'white', textDecoration: 'none' }}>
              Create Event
            </Link>
          )}

          {/* Users button only for admin */}
          {user?.role === 'admin' && (
            <Link to="/admin/users" style={{ color: 'white', textDecoration: 'none' }}>
              Users
            </Link>
          )}

          {!user ? (
            <>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
              <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>Sign Up</Link>
            </>
          ) : (
            <>
              <span style={{ marginRight: 12 }}>Hello, {user.name}</span>
              <Link to="/userprofile" style={{ color: 'white', textDecoration: 'none' }}>Profile</Link>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {menuOpen && (
        <div
          style={{
            display: 'none',
            flexDirection: 'column',
            backgroundColor: '#333',
            padding: '1rem 2rem',
            maxWidth: 1200,
            margin: 'auto',
          }}
          className="dropdown-menu"
        >
          {user?.role === 'admin' ? (
            <Link
              to="/admin/events"
              style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 0' }}
              onClick={() => setMenuOpen(false)}
            >
              Events
            </Link>
          ) : (
            <Link
              to="/events"
              style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 0' }}
              onClick={() => setMenuOpen(false)}
            >
              Events
            </Link>
          )}

          {user?.role === 'organizer' && (
            <Link
              to="/create-event"
              style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 0' }}
              onClick={() => setMenuOpen(false)}
            >
              Create Event
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link
              to="/admin/users"
              style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 0' }}
              onClick={() => setMenuOpen(false)}
            >
              Users
            </Link>
          )}

          {!user ? (
            <>
              <Link
                to="/login"
                style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 0' }}
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 0' }}
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/userprofile"
                style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 0' }}
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  padding: 0,
                  textAlign: 'left',
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 600px) {
          .hamburger {
            display: flex !important;
          }
          .nav-links {
            display: none !important;
          }
          .dropdown-menu {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
}
