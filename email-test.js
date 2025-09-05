const nodemailer = require('nodemailer')
const dotenv = require('dotenv')

dotenv.config()

// initializing a transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURITY_STATUS,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
})

const senderName = "The Social Network"

// defining sendMail() method of the transporter object
async function sendMail() {
    const info = await transporter.sendMail({
        from: `"${senderName}" <${process.env.EMAIL_SENDER}>`,
        to: process.env.EMAIL_RECIPIENT,
        subject: "Welcome to The Social Network",
        text: 'Your One Time Password (OTP) for creating an account is 123456. Your code is valid for 5 minutes and do not share it with anyone else.',
        html: 'Your One Time Password (<b>OTP</b>) for creating an account is <b>123456</b>. Your code is valid for 5 minutes and <b>do not share it<b> with anyone else.'
    })

    console.log("Mail Send to Mailtrap SMTP Server ✅")
    console.log("Message ID: ", info.messageId)
}

sendMail();