import { useState, useEffect } from 'react';
import axios from 'axios';

const BackendStatus = () => {
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('Checking backend connection...');

  const checkBackendStatus = async () => {
    try {
      setStatus('checking');
      setMessage('Checking backend connection...');
      
      // Try to make a simple request to check if backend is available
      const response = await axios.get('http://127.0.0.1:8000/', {
        timeout: 5000
      });
      
      setStatus('connected');
      setMessage('✅ Backend is running and accessible');
    } catch (error) {
      setStatus('disconnected');
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        setMessage('❌ Backend not running. Please start your FastAPI backend on http://127.0.0.1:8000');
      } else {
        setMessage(`❌ Backend connection error: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return '#48bb78';
      case 'disconnected': return '#f56565';
      default: return '#ed8936';
    }
  };

  return (
    <div className="backend-status" style={{ 
      background: 'rgba(255, 255, 255, 0.1)',
      padding: '1rem',
      borderRadius: '8px',
      margin: '1rem 0',
      border: `2px solid ${getStatusColor()}`,
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white'
      }}>
        <div>
          <strong>Backend Status:</strong> {message}
        </div>
        <button
          onClick={checkBackendStatus}
          disabled={status === 'checking'}
          style={{
            background: getStatusColor(),
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}
        >
          {status === 'checking' ? '⏳ Checking...' : '🔄 Recheck'}
        </button>
      </div>
      
      {status === 'disconnected' && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '6px',
          color: 'white',
          fontSize: '0.9rem'
        }}>
          <p><strong>To start the backend:</strong></p>
          <ol>
            <li>Navigate to your backend directory</li>
            <li>Run: <code style={{background: 'rgba(255, 255, 255, 0.15)', padding: '0.2rem 0.4rem', borderRadius: '4px', color: '#e2e8f0', border: '1px solid rgba(255, 255, 255, 0.3)'}}>uvicorn main:app --reload</code></li>
            <li>Ensure it's running on port 8000</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default BackendStatus;