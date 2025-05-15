import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

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

        {/* Hamburger icon */}
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

        {/* Menu links - hidden on small screens, shown on large screens */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
          }}
          className="nav-links"
        >
          <Link to="/events" style={{ color: 'white', textDecoration: 'none' }}>Events</Link>
          <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
          <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>Sign Up</Link>
        </div>
      </div>

      {/* Dropdown menu for small screens */}
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
