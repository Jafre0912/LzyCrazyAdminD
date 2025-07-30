// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { sendMessage } = require('../controllers/messageController');

// Setup multer to handle a single file upload with the field name 'image'
const upload = multer({ dest: 'uploads/' });

// Define the route
router.post('/send', upload.single('image'), sendMessage);

module.exports = router;