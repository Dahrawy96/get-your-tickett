import React from 'react';
import { useNavigate } from 'react-router-dom';
import ticketphoto from './assets/ticketphoto.jpeg'; // Assuming you have a welcome photo in your assets folder

function WelcomePage() {
  const navigate = useNavigate();

  const bgImageUrl = ticketphoto

  const styles = {
    container: {
      height: '100vh',
      backgroundImage: `url(${bgImageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '0 20px',
    },
    heading: {
      fontSize: '3.5rem',
      marginBottom: '10px',
      color: 'rgba(153, 17, 17, 2)',
    },
    subheading: {
      fontSize: '1.5rem',
      marginBottom: '25px',
      color: 'rgba(153, 17, 17, 2)',
      fontWeight: "bold",
    },
    buttonsContainer: {
      display: 'flex',
      gap: '30px',
    },
    button: {
      padding: '12px 30px',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      borderRadius: '30px',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
      transition: 'background-color 0.3s ease, transform 0.2s ease',
    },
    loginBtn: {
      backgroundColor: 'rgb(0, 0, 0)', // green
      color: 'white',
    },
    signupBtn: {
      backgroundColor: 'rgb(0, 0, 0)', // blue
      color: 'white',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to TicketSpot</h1>
      <p style={styles.subheading}>Your gateway to amazing events</p>
      <div style={styles.buttonsContainer}>
        <button
          style={{ ...styles.button, ...styles.loginBtn }}
          onClick={() => navigate('/login')}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Login
        </button>
        <button
          style={{ ...styles.button, ...styles.signupBtn }}
          onClick={() => navigate('/signup')}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default WelcomePage;
