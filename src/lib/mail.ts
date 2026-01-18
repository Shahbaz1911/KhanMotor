import nodemailer from "nodemailer";

if (!process.env.ZOHO_APP_PASSWORD) {
  console.warn("ZOHO_APP_PASSWORD is not set in the environment variables. Email sending will likely fail.");
}

export const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "contact@motorkhan.com",
    pass: process.env.ZOHO_APP_PASSWORD,
  },
});

export const mailOptions = {
    from: '"Motor Khan" <contact@motorkhan.com>',
    to: "contact@motorkhan.com",
};
