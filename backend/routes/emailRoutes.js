const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

const { sendEmail } = require('../controllers/emailController');

router.post('/send', upload.array('attachments', 5), sendEmail);

module.exports = router;