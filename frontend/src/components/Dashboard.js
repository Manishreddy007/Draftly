import React, { useState, useEffect } from 'react';
import { authService, emailService, aiService } from '../services/api';
import EmailList from './EmailList';
import ReplyModal from './ReplyModal';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authService.checkAuth();
      if (response.data.authenticated) {
        setUser(response.data.user);
      } else {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      window.location.href = '/login';
    }
  };

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const response = await emailService.getUnreadEmails();
      setEmails(response.data.emails);
      console.log('Emails fetched:', response.data.emails);
    } catch (error) {
      alert('Error fetching emails: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDraftReply = (email) => {
    setSelectedEmail(email);
    setShowModal(true);
  };

  const handleEmailSent = (emailId) => {
    setEmails(emails.filter(email => email.id !== emailId));
    setShowModal(false);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.userInfo}>
          <img src={user.profilePicture} alt="Profile" style={styles.avatar} />
          <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        </div>
        <div>
          <button onClick={fetchEmails} style={styles.fetchButton} disabled={loading}>
            {loading ? 'Fetching...' : 'Get Unread Emails'}
          </button>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <EmailList 
          emails={emails} 
          onDraftReply={handleDraftReply}
        />
      </main>

      {showModal && (
        <ReplyModal
          email={selectedEmail}
          onClose={() => setShowModal(false)}
          onEmailSent={handleEmailSent}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: 'white',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%'
  },
  fetchButton: {
    padding: '10px 20px',
    backgroundColor: '#34a853',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px'
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#ea4335',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  main: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  }
};

export default Dashboard;