require('dotenv').config();

const { SendMailClient } = require('zeptomail');

const ZEPTOMAIL_TOKEN = process.env.ZEPTOMAIL_API_TOKEN;
const ZEPTOMAIL_URL = 'https://api.zeptomail.com/v1.1/email';

const client = new SendMailClient({
    url: ZEPTOMAIL_URL,
    token: ZEPTOMAIL_TOKEN
});

/**
 * Sends a One-Time Passcode (OTP) email using ZeptoMail.
 * @param {string} recipientEmail - The user's email address.
 * @param {string} otpCode - The generated 6-digit OTP code.
 */
async function sendOTPEmail(recipientEmail, otpCode) {
    // Customize your sender details - must be a verified domain/address
    const SENDER_ADDRESS = 'noreply@kipmckean.app';
    const SENDER_NAME = 'First Principles';
    const EMAIL_SUBJECT = 'Your One-Time Passcode (OTP) for Login';

    // Basic HTML template for the email body
    const htmlBody = `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
            <h2>Hello!</h2>
            <p>Your One-Time Passcode (OTP) is:</p>
            <div style="font-size: 24px; font-weight: bold; background-color: #f5f5f5; padding: 10px; display: inline-block; margin: 15px 0; border-radius: 4px;">
                ${otpCode}
            </div>
            <p>This code is valid for 5 minutes. Do not share it with anyone.</p>
            <p>If you did not request this, please ignore this email.</p>
        </div>
    `;

    try {
        const mailOptions = {
            'from': {
                'address': SENDER_ADDRESS,
                'name': SENDER_NAME
            },
            'to': [
                {
                    'email_address': {
                        'address': recipientEmail
                    }
                }
            ],
            'subject': EMAIL_SUBJECT,
            'htmlbody': htmlBody
        };

        const response = await client.sendMail(mailOptions);

        // ZeptoMail returns an object with a 'message' and an 'id' on success
        console.log('OTP Email Sent Successfully:', response);
        return response;

    } catch (error) {
        console.error('ZeptoMail Error:', error.response ? error.response.data : error.message);
        throw new Error('Failed to send OTP email.');
    }
}

module.exports = { sendOTPEmail };