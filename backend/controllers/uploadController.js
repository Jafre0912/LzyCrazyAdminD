const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const axios = require('axios');

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
  const activeList = Array.from(activeNumbers);
  const duplicates = totalSubmitted - activeList.length - wrongNumbers.size;
  return {
    totalSubmitted,
    activeList,
    totalActive: activeList.length,
    totalWrong: wrongNumbers.size,
    totalDuplicates: duplicates < 0 ? 0 : duplicates,
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
  const activeList = Array.from(activeEmails);
  const duplicates = totalSubmitted - activeList.length - wrongEmails.size;
  return {
    totalSubmitted,
    activeList,
    totalActive: activeList.length,
    totalWrong: wrongEmails.size,
    totalDuplicates: duplicates < 0 ? 0 : duplicates,
  };
};

// Controller for text uploads
exports.uploadText = (req, res) => {
  try {
    const { notepadText, type } = req.body;
    if (!notepadText) return res.status(400).json({ message: 'No text provided.' });
    const rawInput = notepadText.split(/[\s,]+/);
    
    let result;
    if (type === 'emails') {
      result = processEmailList(rawInput);
    } else {
      result = processNumberList(rawInput);
    }
    result.type = type;
    
    res.status(200).json({ message: 'Data processed successfully', result });
  } catch (error) {
    res.status(500).json({ message: 'Error processing text' });
  }
};

// Controller for file uploads
exports.uploadFile = async (req, res) => {
  try {
    const { type } = req.body;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }
    const file = req.files[0];
    let result;
    
    if (file) {
      const response = await axios.get(file.path, { responseType: 'arraybuffer' });
      const buffer = response.data;
      
      const workbook = xlsx.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
      const rawInput = data.flat().filter(cell => cell != null);

      if (type === 'emails') {
        result = processEmailList(rawInput);
      } else {
        result = processNumberList(rawInput);
      }
      result.type = type;
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
    res.status(200).json({ url: req.file.path });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image.' });
  }
};