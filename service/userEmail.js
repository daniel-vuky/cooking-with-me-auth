const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
});

const sendForgotPasswordEmail = asyncHandler(async (email, token) => {
    const callbackUrl = process.env.RESET_PASSWORD_CALLBACK_PAGE;
    const resetUrl = `${callbackUrl}?token=${token}`;
    const sender = process.env.RESET_PASSWORD_SENDER;
    const senderEmail = process.env.MAIL_USER;
    const mailOptions = {
        from: `"${sender}" <${senderEmail}>`,
        to: email,
        subject: 'Password Reset Request',
        html: `
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${resetUrl}">Click here to reset your password</a>
        `
    };
    transporter.sendMail(mailOptions);
});

module.exports = {
    sendForgotPasswordEmail
}