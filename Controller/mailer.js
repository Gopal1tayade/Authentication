
const nodemailer = require('nodemailer');
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service:"gmail",
    secure : true,
    port: 465,
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASS,
    }
});

const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.MAIL,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent');
  } catch (error) {
    console.error('Error sending OTP email:', error);
  }
};

module.exports = sendOtpEmail;
