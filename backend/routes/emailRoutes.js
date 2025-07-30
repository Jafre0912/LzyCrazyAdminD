// routes/emailRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { sendEmail } = require('../controllers/emailController');

// Setup multer to handle multiple files (up to 5) with the field name 'attachments'
const upload = multer({ dest: 'uploads/' });

// ✅ Changed from upload.single('image') to upload.array('attachments', 5)
router.post('/send', upload.array('attachments', 5), sendEmail);

module.exports = router;