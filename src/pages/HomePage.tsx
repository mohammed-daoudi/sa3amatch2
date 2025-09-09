import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#1f2937'
      }}>
        SA3A Match - Test Page
      </h1>
      <div style={{
        maxWidth: '64rem',
        margin: '0 auto'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '1rem',
            color: '#374151'
          }}>
            Book Football Fields in Khouribga
          </h2>
          <p style={{
            color: '#6b7280',
            marginBottom: '1.5rem'
          }}>
            Find and reserve the best football fields in town with real-time availability and weather forecasts.
          </p>
          <div style={{
            display: 'flex',
            gap: '1rem'
          }}>
            <button style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem'
            }}>
              Browse Fields
            </button>
            <button style={{
              backgroundColor: 'transparent',
              color: '#10b981',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              border: '1px solid #10b981',
              cursor: 'pointer',
              fontSize: '1rem'
            }}>
              Sign Up Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
