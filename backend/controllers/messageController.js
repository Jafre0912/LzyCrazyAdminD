const twilio = require('twilio');
const fs = require('fs');
const path = require('path');

// Setup for saving chat history
const dataDir = process.env.DATA_STORAGE_PATH || 'C:\\lzycrazy-data';
const historyFilePath = path.join(dataDir, 'chathistory.json');

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER;
const twilioSmsNumber = process.env.TWILIO_SMS_NUMBER;

// ✅ Helper functions for reading and writing chat history
const readChatHistory = () => {
  if (fs.existsSync(historyFilePath)) {
    return JSON.parse(fs.readFileSync(historyFilePath, 'utf-8'));
  }
  return [];
};

const writeChatHistory = (data) => {
  fs.writeFileSync(historyFilePath, JSON.stringify(data, null, 2));
};

exports.sendMessage = async (req, res) => {
  try {
    const { message, numbers } = req.body;
    const parsedNumbers = JSON.parse(numbers);
    
    const sendPromises = parsedNumbers.map(async (number) => {
      try {
        await client.messages.create({
          body: message,
          from: twilioWhatsAppNumber,
          to: `whatsapp:${number}`
        });
        return { type: 'WhatsApp', status: 'success', number };

      } catch (error) {
        if (error.code === 63016) {
          try {
            await client.messages.create({
              body: message,
              from: twilioSmsNumber,
              to: number
            });
            return { type: 'SMS', status: 'success', number };
          } catch (smsError) {
            return { type: 'SMS', status: 'failed', number, reason: smsError.message };
          }
        } else {
          return { type: 'WhatsApp', status: 'failed', number, reason: error.message };
        }
      }
    });

    const results = await Promise.all(sendPromises);

    let whatsappSent = 0;
    let smsSent = 0;
    let failed = 0;
    results.forEach(r => {
        if (r.status === 'success' && r.type === 'WhatsApp') whatsappSent++;
        if (r.status === 'success' && r.type === 'SMS') smsSent++;
        if (r.status === 'failed') failed++;
    });

    const summaryMessage = `Processing complete. Sent ${whatsappSent} WhatsApp and ${smsSent} SMS messages. ${failed} messages failed.`;

    // ✅ Create and save a new history record
    if (whatsappSent > 0 || smsSent > 0) {
      const history = readChatHistory();
      const newRecord = {
        id: Date.now(),
        date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase(),
        totalMessage: whatsappSent + smsSent,
        messageType: 'Campaign' // You can customize this
      };
      history.unshift(newRecord); // Add to the top of the list
      writeChatHistory(history);
    }

    res.status(200).json({ success: true, message: summaryMessage, results });

  } catch (error) {
    console.error('Error in sendMessage controller:', error);
    res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
  }
};