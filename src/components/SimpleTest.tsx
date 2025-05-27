import React from 'react';

export default function SimpleTest() {
  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #2563eb, #3b82f6)', 
      color: 'white', 
      padding: '2rem',
      borderRadius: '12px',
      margin: '2rem 0'
    }}>
      <h1>Simple Test Component</h1>
      <p>If you can see this blue gradient box, then React component imports are working!</p>
    </div>
  );
} 