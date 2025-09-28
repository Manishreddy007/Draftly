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




app.listen(PORT, () => {
  console.log(`🚀 Draftly server running on port ${PORT}`);
  console.log(`📍 API available at: http://localhost:${PORT}`);
});

module.exports = app;