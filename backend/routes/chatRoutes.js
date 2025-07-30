const express = require('express');
const router = express.Router();
const { getChatHistory } = require('../controllers/chatController');
//const authMiddleware = require('../middleware/authMiddleware');

// You would protect this route so only logged-in users can see it
router.get('/history', getChatHistory);

module.exports = router;