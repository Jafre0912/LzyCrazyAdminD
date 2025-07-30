const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const dataDir = process.env.DATA_STORAGE_PATH || 'C:\\lzycrazy-data';
const contactsFilePath = path.join(dataDir, 'contacts.json');
const emailsFilePath = path.join(dataDir, 'emails.json');

// Helper function to read from a JSON file
const readJsonFile = (filePath, defaultData) => {
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, 'utf-8');
    try {
      return JSON.parse(fileData);
    } catch (e) {
      return defaultData;
    }
  }
  return defaultData;
};

// Helper function to write to a JSON file
const writeJsonFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Helper function to process NUMBER lists
const processNumberList = (inputArray) => {
  const activeNumbers = new Set();
  const wrongNumbers = new Set();
  let totalSubmitted = 0;

  inputArray.forEach(item => {
    const numbersFound = String(item).match(/\d+/g) || [];
    totalSubmitted += numbersFound.length;
    numbersFound.forEach(numStr => {
      const cleanedNum = numStr.replace(/\D/g, '');
      if (cleanedNum.length === 10) {
        activeNumbers.add(cleanedNum);
      } else {
        wrongNumbers.add(numStr);
      }
    });
  });

  return {
    totalSubmitted,
    newActive: Array.from(activeNumbers),
    newWrong: Array.from(wrongNumbers),
  };
};

// Helper function to process EMAIL lists
const processEmailList = (inputArray) => {
  const activeEmails = new Set();
  const wrongEmails = new Set();
  let totalSubmitted = 0;
  const allowedDomains = ['@gmail.com', '@domain.com', '@outlook.com', '@hotmail.com'];

  inputArray.forEach(item => {
    const emailsFound = String(item).match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g) || [];
    totalSubmitted += emailsFound.length;
    emailsFound.forEach(emailStr => {
      const lowercasedEmail = emailStr.toLowerCase();
      const isValid = allowedDomains.some(domain => lowercasedEmail.endsWith(domain));
      if (isValid) {
        activeEmails.add(lowercasedEmail);
      } else {
        wrongEmails.add(emailStr);
      }
    });
  });

  return {
    totalSubmitted,
    newActive: Array.from(activeEmails),
    newWrong: Array.from(wrongEmails),
  };
};

// Generic function to handle the main upload logic
const handleUploadLogic = (rawInput, type, source) => {
  let processed, existingData, writePath, resultKey;

  if (type === 'emails') {
    processed = processEmailList(rawInput);
    existingData = readJsonFile(emailsFilePath, { activeEmails: [] });
    resultKey = 'activeEmails';
    writePath = emailsFilePath;
  } else {
    processed = processNumberList(rawInput);
    existingData = readJsonFile(contactsFilePath, { activeNumbers: [] });
    resultKey = 'activeNumbers';
    writePath = contactsFilePath;
  }
  
  const existingActiveSet = new Set(existingData[resultKey]);
  let duplicateCount = 0;
  processed.newActive.forEach(item => {
    if (existingActiveSet.has(item)) {
      duplicateCount++;
    }
  });

  const updatedActive = new Set([...existingData[resultKey], ...processed.newActive]);
  writeJsonFile(writePath, { [resultKey]: Array.from(updatedActive) });

  return {
    type,
    source,
    totalSubmitted: processed.totalSubmitted,
    totalActive: processed.newActive.length,
    totalWrong: processed.newWrong.length,
    totalDuplicates: duplicateCount,
    activeList: processed.newActive,
  };
};

// Controller for text uploads
exports.uploadText = (req, res) => {
  try {
    const { notepadText, type } = req.body;
    if (!notepadText) return res.status(400).json({ message: 'No text provided.' });
    const rawInput = notepadText.split(/[\s,]+/);
    const result = handleUploadLogic(rawInput, type, 'Text Input');
    res.status(200).json({ message: 'Data processed successfully', result });
  } catch (error) {
    res.status(500).json({ message: 'Error processing text' });
  }
};

// Controller for file uploads
exports.uploadFile = (req, res) => {
  try {
    const { type } = req.body;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }
    const file = req.files[0];
    let result;
    
    if (file) {
      // For Cloudinary, the file is already uploaded, but for local excel processing
      // we might need the path. Here we assume multer-storage-cloudinary is used,
      // which doesn't save excel files locally. For excel processing, you'd need a different setup.
      // We will assume for now that only images are handled by cloudinary in uploadRoutes.
      // This part needs adjustment if you upload excel to cloudinary.
      // For now, let's assume it works with the temp path.
      const workbook = xlsx.readFile(file.path);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
      const rawInput = data.flat().filter(cell => cell != null);
      result = handleUploadLogic(rawInput, type, file.originalname);
      // Since cloudinary handles the file, we don't need to unlink
      // if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    }
    
    res.status(200).json({ message: 'File processed successfully', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing files' });
  }
};

// Controller for handling pasted images from the editor
exports.uploadImageFromEditor = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded.' });
    }
    // Cloudinary gives us the public URL directly in req.file.path
    res.status(200).json({ url: req.file.path });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image.' });
  }
};