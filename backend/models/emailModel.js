const nodemailer = require('nodemailer');
const crypto = require('crypto');  // For generating password

// Set up nodemailer transporter
// const transporter = nodemailer.createTransport({
//     service: 'Mail',
//     auth: {
//         user: 'hhrx0040@gmail.com',
//         pass: 'hcnrdtsniwkmjaf',
//     },
// });
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    service: 'Mail',
    secure: false, // true for 465, false for 587
    auth: {
        user: "hhrx0040@gmail.com",
        pass: "tcox xqau aobm bzhn"
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendAcceptanceEmail = async (email, name) => {
    const password = crypto.randomBytes(6).toString('base64');
    const mailOptions = {
        from: 'hhrx0040@gmail.com',
        to: email,
        subject: 'Demo Request Accepted',
        text: `Dear ${name},\n\nYour demo request has been accepted.\nHere are your login details:\n\nEmail: ${email}\nPassword: ${password}\n\nBest Regards,\nTeam Druma`,
    };
    await transporter.sendMail(mailOptions);
    return { password };
};

const sendRejectionEmail = async (email, name) => {
    const mailOptions = {
        from: 'hhrx0040@gmail.com',
        to: email,
        subject: 'Demo Request Rejected',
        text: `Dear ${name},\n\nYour demo request has been rejected.\n\nBest Regards,\nTeam Druma`,
    };
    await transporter.sendMail(mailOptions);
}

module.exports = {sendAcceptanceEmail, sendRejectionEmail};