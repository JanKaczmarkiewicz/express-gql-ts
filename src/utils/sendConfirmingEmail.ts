import * as nodemailer from "nodemailer";
import { User } from "../types/types";
import { signConfirmingToken } from "./confirmingToken";

export const sendConfirmingEmail = async (user: User) => {
  let testAccount = await nodemailer.createTestAccount();

  const token = signConfirmingToken({ id: user.id });
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"Admin" <foo@example.com>', // sender address
    to: user.email,
    subject: "Confirm account", // Subject line
    text: `Hello ${user.username}`,
    html: `<a href="http://localhost:${process.env.PORT}/confirm/${token}">Confirm your account</a>`,
  });

  console.log("Message sent: %s", info.messageId);

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
