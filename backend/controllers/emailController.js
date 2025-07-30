// controllers/emailController.js
const nodemailer = require('nodemailer');
const fs = require('fs');

exports.sendEmail = async (req, res) => {
  try {
    const { subject, body, emails } = req.body;
    // ✅ req.files will now be an array of files
    const attachedFiles = req.files; 
    const emailList = JSON.parse(emails);

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions = {
      from: `"LzyCrazy App" <${process.env.EMAIL_USER}>`,
      to: emailList.join(', '),
      subject: subject,
      // ✅ Use the 'html' property to send the rich text content
      html: body, 
      attachments: [],
    };
    
    // ✅ If there are attached files, map over them and add to the email
    if (attachedFiles && attachedFiles.length > 0) {
      mailOptions.attachments = attachedFiles.map(file => ({
        filename: file.originalname,
        path: file.path
      }));
    }

    await transporter.sendMail(mailOptions);
    
    // ✅ Clean up all uploaded files
    if (attachedFiles && attachedFiles.length > 0) {
        attachedFiles.forEach(file => fs.unlinkSync(file.path));
    }

    res.status(200).json({ success: true, message: 'Emails sent successfully!' });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send emails.' });
  }
};