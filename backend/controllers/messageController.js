// controllers/messageController.js

// ✅ Import the real Twilio library
const twilio = require('twilio');

// ✅ Initialize Twilio client with your credentials from the .env file
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER;
const twilioSmsNumber = process.env.TWILIO_SMS_NUMBER;


// This is the main controller function
exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const numbers = JSON.parse(req.body.numbers);
    
    const sendPromises = numbers.map(async (number) => {
      try {
        // --- Step 1: Try to send a real WhatsApp message ---
        console.log(`Attempting to send WhatsApp to ${number}...`);
        await client.messages.create({
          body: message,
          from: twilioWhatsAppNumber,
          to: `whatsapp:${number}`
        });
        return { type: 'WhatsApp', status: 'success', number };

      } catch (error) {
        // --- Step 2: Check if the error is "Not a WhatsApp User" ---
        // Twilio error code 63016 means the number is not on WhatsApp
        if (error.code === 63016) {
          console.log(`Number ${number} is not on WhatsApp. Falling back to SMS.`);
          try {
            // --- Step 3: Fallback to sending a real SMS ---
            await client.messages.create({
              body: message,
              from: twilioSmsNumber,
              to: number
            });
            return { type: 'SMS', status: 'success', number };
          } catch (smsError) {
            console.error(`Failed to send SMS to ${number}:`, smsError.message);
            return { type: 'SMS', status: 'failed', number, reason: smsError.message };
          }
        } else {
          // Some other error occurred with WhatsApp
          console.error(`Failed to send WhatsApp to ${number}:`, error.message);
          return { type: 'WhatsApp', status: 'failed', number, reason: error.message };
        }
      }
    });

    const results = await Promise.all(sendPromises);

    // Create a summary of the results
    let whatsappSent = 0;
    let smsSent = 0;
    let failed = 0;
    results.forEach(r => {
        if (r.status === 'success' && r.type === 'WhatsApp') whatsappSent++;
        if (r.status === 'success' && r.type === 'SMS') smsSent++;
        if (r.status === 'failed') failed++;
    });

    const summaryMessage = `Processing complete. Sent ${whatsappSent} WhatsApp and ${smsSent} SMS messages. ${failed} messages failed.`;

    res.status(200).json({ success: true, message: summaryMessage, results });

  } catch (error) {
    console.error('Error in sendMessage controller:', error);
    res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
  }
};