# 📧 Draftly - AI Email Assistant

Draftly is an intelligent email assistant that uses AI to help you draft professional replies to your Gmail messages. Built with React and Node.js, it integrates with Gmail's API and DeepSeek's AI service to generate contextual email replies with customizable tones.

## ✨ Features

- 🔐 **Google OAuth Authentication** - Secure login with your Google account
- 📬 **Gmail Integration** - Fetch and manage unread emails directly
- 🤖 **AI-Powered Replies** - Generate intelligent responses using DeepSeek AI
- 🎭 **Multiple Tones** - Choose from Professional, Friendly, Casual, or Concise
- ✏️ **Editable Replies** - Review and modify AI-generated responses before sending
- 📱 **Responsive Design** - Clean, modern interface that works on all devices
- ⚡ **Real-time Updates** - Live status updates and loading indicators

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Google Cloud Console project with Gmail API enabled
- DeepSeek API account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/draftly.git
   cd draftly
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the `backend` directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/draftly
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
   
   # DeepSeek AI
   DEEPSEEK_API_KEY=your_deepseek_api_key
   DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
   
   # Session
   SESSION_SECRET=your_session_secret_key
   
   # Server
   PORT=5000
   ```

5. **Start the application**
   
   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm start
   ```

6. **Access the application**
   
   Open your browser and navigate to `http://localhost:3000`

## 🏗️ Project Structure
draftly/
├── backend/
│ ├── app.js # Main server file
│ ├── config/
│ │ ├── database.js # MongoDB connection
│ │ └── passport.js # Google OAuth configuration
│ ├── controllers/
│ │ ├── aiController.js # AI reply generation logic
│ │ └── emailController.js # Email management logic
│ ├── models/
│ │ └── User.js # User data model
│ ├── routes/
│ │ ├── auth.js # Authentication routes
│ │ ├── emails.js # Email API routes
│ │ └── ai.js # AI API routes
│ └── services/
│ ├── deepseekService.js # DeepSeek AI integration
│ └── gmailService.js # Gmail API integration
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Dashboard.js # Main dashboard component
│ │ │ ├── EmailList.js # Email list display
│ │ │ ├── Login.js # Login component
│ │ │ └── ReplyModal.js # AI reply interface
│ │ └── services/
│ │ └── api.js # API service layer
│ └── package.json
└── README.md

## 🔧 API Endpoints

### Authentication
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/check` - Check authentication status
- `POST /auth/logout` - Logout user

### Emails
- `GET /api/emails/unread` - Fetch unread emails
- `POST /api/emails/send-reply` - Send email reply
- `POST /api/emails/mark-read` - Mark email as read

### AI
- `POST /api/ai/generate-reply` - Generate AI reply
- `POST /api/ai/regenerate-reply` - Regenerate AI reply

## 🎯 Usage

1. **Login**: Click "Login with Google" to authenticate
2. **Fetch Emails**: Click "Get Unread Emails" to load your messages
3. **Generate Reply**: Click "Draft AI Reply" on any email
4. **Choose Tone**: Select from Professional, Friendly, Casual, or Concise
5. **Review & Edit**: Modify the AI-generated reply if needed
6. **Send**: Click "Send Reply" to send the email

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Passport.js** - Authentication middleware
- **Google APIs** - Gmail integration
- **DeepSeek API** - AI service

### Frontend
- **React** - UI library
- **Axios** - HTTP client
- **React Router** - Navigation
- **CSS3** - Styling

## 🔐 Security Features

- OAuth 2.0 authentication with Google
- Secure session management
- CORS protection
- Input validation and sanitization
- Error handling and logging

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `GOOGLE_CALLBACK_URL` | OAuth callback URL | Yes |
| `DEEPSEEK_API_KEY` | DeepSeek API key | Yes |
| `DEEPSEEK_API_URL` | DeepSeek API endpoint | Yes |
| `SESSION_SECRET` | Session encryption key | Yes |
| `PORT` | Server port | No (default: 5000) |


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

1. **Google OAuth not working**
   - Ensure Gmail API is enabled in Google Cloud Console
   - Check redirect URIs match exactly
   - Verify client ID and secret are correct

2. **DeepSeek API errors**
   - Verify API key is valid
   - Check API quota limits
   - Ensure proper request format

3. **MongoDB connection issues**
   - Verify MongoDB is running
   - Check connection string format
   - Ensure database permissions

*Draftly - Making email management effortless with AI*
