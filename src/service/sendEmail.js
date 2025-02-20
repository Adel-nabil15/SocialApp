import nodemailer from "nodemailer";

const Send_Email = async ({ to, subject, html, attachments }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    auth: {
      user: "nabiladel052@gmail.com",
      pass: "rbvvjsydcepoyuvv",
    },
  });

  const info = await transporter.sendMail({
    from: '"Adel:👻" <nabiladel052@gmail.com>',
    to: to,
    subject: subject,
    html: html,
    attachments: attachments ? attachments : [],
  });
  if (info.accepted.length) {
    return true;
  }
  return false;
};

export default Send_Email;
