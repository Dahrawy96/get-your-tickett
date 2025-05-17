import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function EventAnalyticsModal({ data, onClose }) {
  if (!data) return null;

  // Filter the analytics for the current event
  const chartData = [{
    name: data.title,
    bookedPercentage: parseFloat(data.percentageBooked),
  }];

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        maxWidth: 400,
        width: '90%',
      }}>
        <h3>Event Booking Analytics</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis unit="%" domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="bookedPercentage" fill="#6a1b9a" />
          </BarChart>
        </ResponsiveContainer>

        <button
          onClick={onClose}
          style={{
            marginTop: 10,
            padding: '8px 16px',
            backgroundColor: '#6a1b9a',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
