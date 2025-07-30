const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

const { uploadText, uploadFile, uploadImageFromEditor } = require('../controllers/uploadController');

router.post('/text', uploadText);
router.post('/file', upload.array('files'), uploadFile);
router.post('/image', upload.single('image'), uploadImageFromEditor);

module.exports = router;