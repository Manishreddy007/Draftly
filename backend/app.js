// Load environment variables FIRST
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');  // ADD THIS LINE
const connectDB = require('./config/database');
const passport = require('./config/passport');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use(cors({
  origin: 'http://localhost:3000',  // React app URL
  credentials: true  // Allow cookies/sessions
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Body parsing middleware
app.use(express.json());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/api/emails', require('./routes/emails')); 
app.use('/api/ai', require('./routes/ai'));

// Basic routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Draftly API is running!',
    status: 'success',
    version: '1.0.0'
  });
});

// // Login page (for testing)
// app.get('/login', (req, res) => {
//   res.send(`
//     <h1>Draftly - Gmail Auto Reply</h1>
//     <p>Please login with your Google account to access Gmail features.</p>
//     <a href="/auth/google" style="
//       display: inline-block; 
//       padding: 10px 20px; 
//       background-color: #4285f4; 
//       color: white; 
//       text-decoration: none; 
//       border-radius: 5px;
//       font-family: Arial, sans-serif;
//     ">Login with Google</a>
//   `);
// });

// // Dashboard (after successful login) - UPDATED WITH SEND FUNCTIONALITY
// app.get('/dashboard', (req, res) => {
//   if (!req.user) {
//     return res.redirect('/login');
//   }
  
//   res.send(`
//     <h1>Welcome to Draftly Dashboard!</h1>
//     <div style="font-family: Arial, sans-serif;">
//       <img src="${req.user.profilePicture}" style="border-radius: 50%; width: 50px; height: 50px;">
//       <h2>Hello, ${req.user.name}!</h2>
//       <p>Email: ${req.user.email}</p>
//       <p>Status: ✅ Gmail Connected</p>
      
//       <div style="margin-top: 20px;">
//         <button onclick="fetchEmails()" style="
//           padding: 10px 20px; 
//           background-color: #34a853; 
//           color: white; 
//           border: none; 
//           border-radius: 5px; 
//           cursor: pointer;
//           margin-right: 10px;
//         ">Get Unread Emails</button>
        
//         <form method="POST" action="/auth/logout" style="display: inline;">
//           <button type="submit" style="
//             padding: 10px 20px; 
//             background-color: #ea4335; 
//             color: white; 
//             border: none; 
//             border-radius: 5px; 
//             cursor: pointer;
//           ">Logout</button>
//         </form>
//       </div>
      
//       <div id="emails-container" style="margin-top: 30px; max-width: 800px;">
//         <!-- Emails will be displayed here -->
//       </div>
      
//       <!-- AI Reply Modal -->
//       <div id="ai-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 1000;">
//         <div style="position: relative; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 10px; max-width: 600px; width: 90%;">
//           <h3>AI Generated Reply</h3>
//           <div id="original-email-info" style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; margin-bottom: 15px;"></div>
          
//           <label for="tone-select">Reply Tone:</label>
//           <select id="tone-select" style="margin-bottom: 15px; padding: 5px;">
//             <option value="professional">Professional</option>
//             <option value="friendly">Friendly</option>
//             <option value="casual">Casual</option>
//             <option value="concise">Concise</option>
//           </select>
          
//           <textarea id="ai-reply-text" style="width: 100%; height: 200px; margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;"></textarea>
          
//           <div id="send-status" style="margin-bottom: 10px; padding: 10px; border-radius: 5px; display: none;"></div>
          
//           <div style="text-align: right;">
//             <button onclick="closeAIModal()" style="padding: 8px 16px; margin-right: 10px; background-color: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
//             <button onclick="regenerateReply()" style="padding: 8px 16px; margin-right: 10px; background-color: #ffc107; color: black; border: none; border-radius: 4px; cursor: pointer;">Redo</button>
//             <button id="send-button" onclick="sendReply()" style="padding: 8px 16px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">Send Reply</button>
//           </div>
//         </div>
//       </div>
//     </div>
    
//     <script>
//       let currentEmailId = null;
//       let currentEmailElement = null;
      
//       async function fetchEmails() {
//         const button = event.target;
//         button.disabled = true;
//         button.textContent = 'Fetching...';
        
//         try {
//           const response = await fetch('/api/emails/unread');
//           const data = await response.json();
          
//           if (data.success) {
//             displayEmails(data.emails);
//           } else {
//             alert('Error: ' + data.error);
//           }
//         } catch (error) {
//           alert('Error fetching emails: ' + error.message);
//         } finally {
//           button.disabled = false;
//           button.textContent = 'Get Unread Emails';
//         }
//       }
      
//       function displayEmails(emails) {
//         const container = document.getElementById('emails-container');
        
//         if (emails.length === 0) {
//           container.innerHTML = '<p>📪 No unread emails found!</p>';
//           return;
//         }
        
//         let html = '<h3>📧 Your Unread Emails (' + emails.length + '):</h3>';
        
//         emails.forEach((email, index) => {
//           html += \`
//             <div id="email-\${email.id}" style="border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 8px; background-color: #f9f9f9;">
//               <div style="margin-bottom: 10px;">
//                 <strong>From:</strong> \${email.from}<br>
//                 <strong>Subject:</strong> \${email.subject}<br>
//                 <strong>Date:</strong> \${email.date}
//               </div>
//               <div style="background-color: white; padding: 10px; border-radius: 4px; margin-bottom: 10px;">
//                 <strong>Preview:</strong><br>
//                 <div style="font-style: italic; color: #666;">
//                   \${email.snippet || email.body}
//                 </div>
//               </div>
//               <button onclick="draftReply('\${email.id}', '\${email.from.replace(/'/g, "\\\\'")}', '\${email.subject.replace(/'/g, "\\\\'")}')" style="padding: 8px 16px; background-color: #1a73e8; color: white; border: none; border-radius: 4px; cursor: pointer;">Draft AI Reply</button>
//             </div>
//           \`;
//         });
        
//         container.innerHTML = html;
//       }
      
//       async function draftReply(emailId, fromEmail, subject) {
//         currentEmailId = emailId;
//         currentEmailElement = document.getElementById('email-' + emailId);
        
//         // Show original email info
//         document.getElementById('original-email-info').innerHTML = \`
//           <strong>Replying to:</strong> \${fromEmail}<br>
//           <strong>Subject:</strong> Re: \${subject}
//         \`;
        
//         // Reset send status
//         document.getElementById('send-status').style.display = 'none';
//         document.getElementById('send-button').disabled = false;
        
//         // Show modal
//         document.getElementById('ai-modal').style.display = 'block';
        
//         // Generate initial reply
//         await generateAIReply();
//       }
      
//       async function generateAIReply() {
//         const tone = document.getElementById('tone-select').value;
//         const textarea = document.getElementById('ai-reply-text');
        
//         textarea.value = 'Generating AI reply...';
        
//         try {
//           const response = await fetch('/api/ai/generate-reply', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ 
//               emailId: currentEmailId, 
//               tone: tone 
//             })
//           });
          
//           const data = await response.json();
          
//           if (data.success) {
//             textarea.value = data.generatedReply;
//           } else {
//             textarea.value = 'Error generating reply: ' + data.error;
//           }
//         } catch (error) {
//           textarea.value = 'Error: ' + error.message;
//         }
//       }
      
//       async function regenerateReply() {
//         await generateAIReply();
//       }
      
//       function closeAIModal() {
//         document.getElementById('ai-modal').style.display = 'none';
//         currentEmailId = null;
//         currentEmailElement = null;
//       }
      
//       async function sendReply() {
//         const replyContent = document.getElementById('ai-reply-text').value;
//         const sendButton = document.getElementById('send-button');
//         const statusDiv = document.getElementById('send-status');
        
//         if (!replyContent.trim()) {
//           alert('Reply content cannot be empty!');
//           return;
//         }
        
//         sendButton.disabled = true;
//         sendButton.textContent = 'Sending...';
//         statusDiv.style.display = 'block';
//         statusDiv.style.backgroundColor = '#ffc107';
//         statusDiv.textContent = 'Sending reply...';
        
//         try {
//           const response = await fetch('/api/emails/send-reply', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ 
//               emailId: currentEmailId,
//               replyContent: replyContent 
//             })
//           });
          
//           const data = await response.json();
          
//           if (data.success) {
//             // Show success message
//             statusDiv.style.backgroundColor = '#28a745';
//             statusDiv.textContent = '✅ Reply sent successfully! Email marked as read.';
            
//             // Remove the email from the list after 2 seconds
//             setTimeout(() => {
//               if (currentEmailElement) {
//                 currentEmailElement.style.transition = 'opacity 0.5s';
//                 currentEmailElement.style.opacity = '0';
//                 setTimeout(() => {
//                   currentEmailElement.remove();
                  
//                   // Check if there are any emails left
//                   const remainingEmails = document.querySelectorAll('[id^="email-"]').length;
//                   if (remainingEmails === 0) {
//                     document.getElementById('emails-container').innerHTML = '<p>📪 No unread emails found!</p>';
//                   } else {
//                     // Update the count in the header
//                     const header = document.querySelector('#emails-container h3');
//                     if (header) {
//                       header.textContent = '📧 Your Unread Emails (' + remainingEmails + '):';
//                     }
//                   }
//                 }, 500);
//               }
//               closeAIModal();
//             }, 2000);
            
//           } else {
//             statusDiv.style.backgroundColor = '#dc3545';
//             statusDiv.textContent = '❌ Error: ' + data.error;
//             sendButton.disabled = false;
//             sendButton.textContent = 'Send Reply';
//           }
//         } catch (error) {
//           statusDiv.style.backgroundColor = '#dc3545';
//           statusDiv.textContent = '❌ Error: ' + error.message;
//           sendButton.disabled = false;
//           sendButton.textContent = 'Send Reply';
//         }
//       }
      
//       // Change tone and regenerate
//       document.addEventListener('DOMContentLoaded', function() {
//         document.getElementById('tone-select').addEventListener('change', function() {
//           if (currentEmailId) {
//             generateAIReply();
//           }
//         });
//       });
//     </script>
//   `);
// });

// // Login failed
// app.get('/login-failed', (req, res) => {
//   res.send(`
//     <h1>Login Failed</h1>
//     <p>Something went wrong with the Google authentication.</p>
//     <a href="/login">Try Again</a>
//   `);
// });


app.listen(PORT, () => {
  console.log(`🚀 Draftly server running on port ${PORT}`);
  console.log(`📍 API available at: http://localhost:${PORT}`);
});

module.exports = app;