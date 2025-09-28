const deepseekService = require('../services/deepseekService');
const GmailService = require('../services/gmailService');

const generateReply = async (req, res) => {
  try {
    // Check authentication
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { emailId, tone = 'professional' } = req.body;

    if (!emailId) {
      return res.status(400).json({ error: 'Email ID is required' });
    }

    console.log(`👤 User ${req.user.email} requesting AI reply for email ${emailId}`);

    // Get email details first
    const gmailService = new GmailService(
      req.user.accessToken, 
      req.user.refreshToken
    );

    const emailDetails = await gmailService.getEmailDetails(emailId);
    
    if (!emailDetails) {
      return res.status(404).json({ error: 'Email not found' });
    }

    // Validate tone
    const validTones = ['professional', 'friendly', 'casual', 'concise'];
    if (!validTones.includes(tone)) {
      return res.status(400).json({ 
        error: 'Invalid tone. Must be one of: ' + validTones.join(', ')
      });
    }

    // Generate AI reply
    const aiReply = await deepseekService.generateReply(emailDetails, tone);

 

    res.json({
      success: true,
      emailId: emailId,
      originalSubject: emailDetails.subject,
      originalFrom: emailDetails.from,
      generatedReply: aiReply.reply,
      tone: aiReply.tone,
      timestamp: aiReply.timestamp
    });

  } catch (error) {
    console.error('❌ Error in generateReply:', error.message);

    if (error.message.includes('DeepSeek API')) {
      return res.status(503).json({
        error: 'AI service temporarily unavailable',
        details: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to generate reply',
      details: error.message
    });
  }
};

const regenerateReply = async (req, res) => {
  try {

    await generateReply(req, res);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to regenerate reply',
      details: error.message
    });
  }
};

module.exports = {
  generateReply,
  regenerateReply
};