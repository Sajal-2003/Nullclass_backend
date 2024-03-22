("use strict");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: "sajal72003@gmail.com",
    pass: "rjgnhyldcfcqagee",
  },
});

async function sendMail(recipient, subject, text) {
  const info = await transporter.sendMail({
    from: "sajal72003@gmail.com",
    to: recipient,
    subject,
    text,
  });

  console.log("Message sent: %s", info.messageId);
}

sendMail().catch(console.error);

module.exports = sendMail;
