const nodemailer = require('nodemailer');
require('dotenv').config();
const name = 'Your name';
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.PASSWORD_EMAIL_FROM,
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: 'YA HAY CUPOS!!!',
    text: `${name} MI REY YA SE PUEDE INSCRIBIR EN LOS CURSOS DE LA UNI`,
    attachments: [
      {
        filename: 'capturaPagina.png',
        path: __dirname + '/images/capturaPagina.png',
      }
    ]
  });
}

module.exports = {
  main
};