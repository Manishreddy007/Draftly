import React from 'react';

function EmailList({ emails, onDraftReply }) {
  if (emails.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p>📪 No unread emails found!</p>
      </div>
    );
  }

  return (
    <div>
      <h3>📧 Your Unread Emails ({emails.length}):</h3>
      {emails.map(email => (
        <div key={email.id} style={styles.emailCard}>
          <div style={styles.emailHeader}>
            <strong>From:</strong> {email.from}<br />
            <strong>Subject:</strong> {email.subject}<br />
            <strong>Date:</strong> {email.date}
          </div>
          <div style={styles.emailBody}>
            <strong>Preview:</strong><br />
            <div style={styles.snippet}>
              {email.snippet || email.body}
            </div>
          </div>
          <button 
            onClick={() => onDraftReply(email)}
            style={styles.replyButton}
          >
            Draft AI Reply
          </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#666'
  },
  emailCard: {
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px'
  },
  emailHeader: {
    marginBottom: '10px',
    lineHeight: '1.6'
  },
  emailBody: {
    backgroundColor: '#f9f9f9',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '10px'
  },
  snippet: {
    fontStyle: 'italic',
    color: '#666',
    marginTop: '5px'
  },
  replyButton: {
    padding: '8px 16px',
    backgroundColor: '#1a73e8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default EmailList;