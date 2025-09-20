import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div style={{ padding: '40px', backgroundColor: '#f0f0f0', minHeight: '80vh' }}>
      <h1 style={{ color: '#333', fontSize: '48px', marginBottom: '20px' }}>
        Sa3aMatch - Football Field Booking
      </h1>
      <p style={{ color: '#666', fontSize: '18px', marginBottom: '30px' }}>
        The best platform for booking football fields in Khouribga
      </p>

      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#10B981', fontSize: '24px', marginBottom: '15px' }}>
          Featured Fields
        </h2>
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '6px', marginBottom: '15px' }}>
          <h3 style={{ color: '#333', fontSize: '18px', marginBottom: '8px' }}>Stadium Khouribga</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>Modern football field with high-quality grass - 150 MAD/hour</p>
        </div>
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '6px', marginBottom: '15px' }}>
          <h3 style={{ color: '#333', fontSize: '18px', marginBottom: '8px' }}>Complex Sportif Al Wifaq</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>Community sports complex with multiple facilities - 120 MAD/hour</p>
        </div>
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '6px' }}>
          <h3 style={{ color: '#333', fontSize: '18px', marginBottom: '8px' }}>Terrain Synthétique Benguerir</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>Premium synthetic field with international standards - 180 MAD/hour</p>
        </div>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button
          style={{
            backgroundColor: '#10B981',
            color: 'white',
            padding: '12px 24px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Browse All Fields
        </button>
        <button
          style={{
            backgroundColor: 'transparent',
            color: '#10B981',
            padding: '12px 24px',
            fontSize: '16px',
            border: '2px solid #10B981',
            borderRadius: '6px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Sign Up Now
        </button>
      </div>
    </div>
  );
};

export default HomePage;
