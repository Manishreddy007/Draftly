const { google } = require('googleapis');

class GmailService {
  constructor(accessToken, refreshToken) {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL
    );
    
    // Set user credentials
    this.oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });
    
    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
  }

  async getUnreadEmails(maxResults = 5) {
    try {
      console.log('📬 Fetching unread emails...');
      
      // Get list of unread messages
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: 'is:unread',
        maxResults: maxResults
      });

      if (!response.data.messages) {
        console.log('📪 No unread messages found');
        return [];
      }

      console.log(`📧 Found ${response.data.messages.length} unread messages`);

      // Get full details for each message
      const emailPromises = response.data.messages.map(message => 
        this.getEmailDetails(message.id)
      );

      const emails = await Promise.all(emailPromises);
      
      console.log('✅ Successfully fetched email details');
      return emails;

    } catch (error) {
      console.error('❌ Error fetching emails:', error.message);
      throw new Error(`Failed to fetch emails: ${error.message}`);
    }
  }

  async getEmailDetails(messageId) {
    try {
      const response = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId
      });

      const message = response.data;
      const headers = message.payload.headers;

      // Extract email information
      const emailData = {
        id: message.id,
        threadId: message.threadId,
        subject: this.getHeader(headers, 'Subject') || 'No Subject',
        from: this.getHeader(headers, 'From') || 'Unknown Sender',
        to: this.getHeader(headers, 'To') || '',
        date: this.getHeader(headers, 'Date') || '',
        snippet: message.snippet || '',
        body: this.extractEmailBody(message.payload)
      };

      return emailData;

    } catch (error) {
      console.error(`❌ Error getting email details for ${messageId}:`, error.message);
      return null;
    }
  }

  getHeader(headers, name) {
    const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
    return header ? header.value : null;
  }

  extractEmailBody(payload) {
    let body = '';

    if (payload.body && payload.body.data) {
      body = Buffer.from(payload.body.data, 'base64').toString('utf-8');
    } else if (payload.parts) {
      // Handle multipart emails
      for (const part of payload.parts) {
        if (part.mimeType === 'text/plain' && part.body.data) {
          body = Buffer.from(part.body.data, 'base64').toString('utf-8');
          break;
        }
      }
      
      // Fallback to HTML if no plain text
      if (!body) {
        for (const part of payload.parts) {
          if (part.mimeType === 'text/html' && part.body.data) {
            body = Buffer.from(part.body.data, 'base64').toString('utf-8');
            // Remove HTML tags for preview
            body = body.replace(/<[^>]*>/g, '');
            break;
          }
        }
      }
    }

    // Clean up and truncate body for preview
    body = body.replace(/\r\n/g, '\n').trim();
    if (body.length > 500) {
      body = body.substring(0, 500) + '...';
    }

    return body;
  }
  async markAsRead(messageId) {
    try {
      console.log(`📖 Marking email ${messageId} as read...`);

      // Remove the UNREAD label
      await this.gmail.users.messages.modify({
        userId: 'me',
        id: messageId,
        requestBody: {
          removeLabelIds: ['UNREAD']
        }
      });

      console.log('✅ Email marked as read successfully');
      return { success: true, messageId };

    } catch (error) {
      console.error('❌ Error marking email as read:', error.message);
      throw new Error(`Failed to mark email as read: ${error.message}`);
    }
  }
  async sendReply(originalEmailId, replyContent) {
    try {
      console.log(`📤 Sending reply for email ${originalEmailId}`);

      // Get original email details
      const originalEmail = await this.gmail.users.messages.get({
        userId: 'me',
        id: originalEmailId
      });

      const originalHeaders = originalEmail.data.payload.headers;
      
      // Extract necessary headers for reply
      const originalSubject = this.getHeader(originalHeaders, 'Subject') || '';
      const originalFrom = this.getHeader(originalHeaders, 'From') || '';
      const originalMessageId = this.getHeader(originalHeaders, 'Message-ID') || '';
      const originalReferences = this.getHeader(originalHeaders, 'References') || '';
      
      // Create reply subject
      const replySubject = originalSubject.startsWith('Re:') ? originalSubject : `Re: ${originalSubject}`;
      
      // Build references chain
      const references = originalReferences ? `${originalReferences} ${originalMessageId}` : originalMessageId;

      // Create the raw email message
      const rawMessage = this.createRawReplyMessage({
        to: originalFrom,
        subject: replySubject,
        body: replyContent,
        inReplyTo: originalMessageId,
        references: references
      });

      // Send the reply
      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: rawMessage,
          threadId: originalEmail.data.threadId
        }
      });

      console.log('✅ Reply sent successfully:', response.data.id);
      await this.markAsRead(originalEmailId);
      console.log('✅ Original email marked as read');
      return {
        messageId: response.data.id,
        threadId: response.data.threadId,
        success: true
      };

    } catch (error) {
      console.error('❌ Error sending reply:', error.message);
      throw new Error(`Failed to send reply: ${error.message}`);
    }
  }

  createRawReplyMessage({ to, subject, body, inReplyTo, references }) {
    // Get current user email from OAuth
    const currentUserEmail = 'me'; // Gmail API will use the authenticated user
    
    const messageParts = [
      'MIME-Version: 1.0',
      `To: ${to}`,
      `Subject: ${subject}`,
      `In-Reply-To: ${inReplyTo}`,
      `References: ${references}`,
      'Content-Type: text/plain; charset=utf-8',
      'Content-Transfer-Encoding: quoted-printable',
      '',
      body
    ];
    
    const message = messageParts.join('\n');
    
    // Encode to base64url format
    return Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}

module.exports = GmailService;