import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      marginTop: '3rem',
      paddingTop: '1rem',
      borderTop: '1px solid rgba(255, 255, 255, 0.3)',
      color: 'white',
      fontSize: '0.9rem',
    }}>
      <div style={{ maxWidth: 1200, margin: 'auto', display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px' }}>
          <h3>Contact</h3>
          <p>Email: <a href="mailto:support@ticketmaster.com" style={{color: '#61dafb', textDecoration: 'none'}}>seif.eldahrawy@gmail.com</a></p>
          <p>Phone: <a href="tel:+1234567890" style={{color: '#61dafb', textDecoration: 'none'}}>+201000090559</a></p>
        </div>
        <div style={{ flex: '2 1 400px' , fontSize: 15}}>
          <h3>About</h3>
          <p>
            TicketMaster is an online event ticketing system that allows users to browse and book tickets for various events easily and securely.
          </p>
        </div>
      </div>
    </footer>
  );
}
