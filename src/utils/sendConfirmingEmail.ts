import * as nodemailer from "nodemailer";
import { User } from "../types/types";
import { signConfirmingToken } from "./confirmingToken";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SENDER_ADDRESS,
    pass: process.env.EMAIL_SENDER_PASSWORD,
  },
});

export const sendConfirmingEmail = async (user: User) => {
  const token = signConfirmingToken({ id: user.id });

  await transporter.sendMail(
    {
      from: "positiveKiddo@gmail.com", // sender address
      to: user.email,
      subject: "Confirm account", // Subject line
      text: `Hello ${user.username}`,
      html: `<a href="http://localhost:${process.env.PORT}/confirm/${token}">Confirm your account</a>`,
      // html: "RAFAŁ JEST GŁUPI I PAWEŁ TEŹ",
    },
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
};
