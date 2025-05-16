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

        {/* Hamburger icon (optional, keep your previous style) */}
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

        {/* Menu links */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
          }}
          className="nav-links"
        >
          <Link to="/events" style={{ color: 'white', textDecoration: 'none' }}>Events</Link>

          {!user ? (
            <>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
              <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>Sign Up</Link>
            </>
          ) : (
            <>
              <span style={{ marginRight: 10 }}>Hello, {user.name}</span>
              <Link to="/userprofile" style={{ color: 'white', textDecoration: 'none' }}>Profile</Link>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Dropdown menu for small screens (if you want to keep it) */}
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
          <Link
            to="/events"
            style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 0' }}
            onClick={() => setMenuOpen(false)}
          >
            Events
          </Link>
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

      {/* CSS for responsiveness */}
      <style>{`
        /* Show hamburger on screens smaller than 600px */
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
