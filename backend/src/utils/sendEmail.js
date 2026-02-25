/**
 * Email Utility
 * Handles sending emails using Nodemailer
 */
const nodemailer = require("nodemailer");


/**
 * Send email
 * @param {Object} options - Email options
 * @param {string} options.to - Receiver email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Email body text
 * @returns {Promise<void>}
 */
const sendEmail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true only for 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"HiLearn LMS" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;


