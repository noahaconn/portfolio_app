import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendContactEmail(subject: string, body: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'noahconn2020@gmail.com',
    subject,
    text: body,
  };
  await transporter.sendMail(mailOptions);
}
