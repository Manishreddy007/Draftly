import React from 'react';
import { authService } from '../services/api';

function Login() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Draftly</h1>
        <p style={styles.subtitle}>Gmail Auto Reply Assistant</p>
        <p style={styles.description}>
          Login with your Google account to access Gmail features and start generating AI-powered email replies.
        </p>
        <button 
          onClick={authService.loginWithGoogle}
          style={styles.button}
        >
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            style={styles.icon}
          />
          Login with Google
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '400px'
  },
  title: {
    color: '#1a73e8',
    marginBottom: '10px'
  },
  subtitle: {
    color: '#666',
    marginBottom: '20px'
  },
  description: {
    color: '#333',
    marginBottom: '30px',
    lineHeight: '1.5'
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: '#4285f4',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  icon: {
    width: '20px',
    height: '20px',
    marginRight: '10px'
  }
};

export default Login;