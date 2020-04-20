import * as nodemailer from "nodemailer";
import { User } from "../types/types";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SENDER_ADDRESS,
    pass: process.env.EMAIL_SENDER_PASSWORD,
  },
});

export const sendConfirmingEmail = async (token: string, user: User) => {
  transporter.sendMail(
    {
      from: process.env.EMAIL_SENDER_ADDRESS,
      to: user.email,
      subject: "Confirm account",
      text: `Hello ${user.username}`,
      html: `<a href="http://localhost:${process.env.PORT}/confirm/${token}">Confirm your account</a>`,
    },
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
};
