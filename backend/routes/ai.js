const express = require('express');
const { generateReply, regenerateReply } = require('../controllers/aiController');
const router = express.Router();

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Generate AI reply
router.post('/generate-reply', requireAuth, generateReply);

// Regenerate AI reply (redo)
router.post('/regenerate-reply', requireAuth, regenerateReply);

module.exports = router;