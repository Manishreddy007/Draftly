import React, { useState, useEffect } from 'react';
import { aiService, emailService } from '../services/api';

function ReplyModal({ email, onClose, onEmailSent }) {
  const [tone, setTone] = useState('professional');
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    generateReply();
  }, [tone]);

  const generateReply = async () => {
    setLoading(true);
    setStatus('Generating AI reply...');
    try {
      const response = await aiService.generateReply(email.id, tone);
      setReplyContent(response.data.generatedReply);
      setStatus('');
    } catch (error) {
      setStatus('Error generating reply: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!replyContent.trim()) {
      alert('Reply content cannot be empty!');
      return;
    }

    setSending(true);
    setStatus('Sending reply...');
    try {
      await emailService.sendReply(email.id, replyContent);
      setStatus('✅ Reply sent successfully!');
      setTimeout(() => {
        onEmailSent(email.id);
      }, 1500);
    } catch (error) {
      setStatus('❌ Error: ' + error.message);
      setSending(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>AI Generated Reply</h3>
        
        <div style={styles.emailInfo}>
          <strong>Replying to:</strong> {email.from}<br />
          <strong>Subject:</strong> Re: {email.subject}
        </div>

        <div style={styles.toneSelector}>
          <label>Reply Tone: </label>
          <select 
            value={tone} 
            onChange={(e) => setTone(e.target.value)}
            disabled={loading || sending}
            style={styles.select}
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="casual">Casual</option>
            <option value="concise">Concise</option>
          </select>
        </div>

        <textarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          style={styles.textarea}
          disabled={loading || sending}
        />

        {status && (
          <div style={styles.status}>
            {status}
          </div>
        )}

        <div style={styles.buttons}>
          <button 
            onClick={onClose} 
            style={styles.cancelButton}
            disabled={sending}
          >
            Cancel
          </button>
          <button 
            onClick={generateReply} 
            style={styles.redoButton}
            disabled={loading || sending}
          >
            Regenerate
          </button>
          <button 
            onClick={handleSend} 
            style={styles.sendButton}
            disabled={loading || sending}
          >
            {sending ? 'Sending...' : 'Send Reply'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '600px'
  },
  emailInfo: {
    backgroundColor: '#f5f5f5',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '15px'
  },
  toneSelector: {
    marginBottom: '15px'
  },
  select: {
    marginLeft: '10px',
    padding: '5px'
  },
  textarea: {
    width: '100%',
    height: '200px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    fontFamily: 'inherit'
  },
  status: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '5px'
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '15px'
  },
  cancelButton: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  redoButton: {
    padding: '8px 16px',
    backgroundColor: '#ffc107',
    color: 'black',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  sendButton: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default ReplyModal;