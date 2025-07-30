const fs = require('fs');
const path = require('path');

const dataDir = process.env.DATA_STORAGE_PATH || 'C:\\lzycrazy-data';
const historyFilePath = path.join(dataDir, 'chathistory.json');

exports.getChatHistory = (req, res) => {
  try {
    // For now, we return dummy data, like in your frontend
    // In a real app, you would read this from a file
    const dummyHistory = [
      { id: 1, date: '14-07-2025', time: '14:58', totalMessage: 200, messageType: 'WhatsApp' },
      { id: 2, date: '13-07-2025', time: '11:30', totalMessage: 150, messageType: 'Text' },
    ];
    
    // Example of how you would save it
    // if (!fs.existsSync(historyFilePath)) {
    //   fs.writeFileSync(historyFilePath, JSON.stringify(dummyHistory, null, 2));
    // }
    
    // Example of how you would read it
    // const history = JSON.parse(fs.readFileSync(historyFilePath, 'utf-8'));

    res.status(200).json(dummyHistory);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};