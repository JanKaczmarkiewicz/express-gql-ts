import * as yup from "yup";

const password = yup
  .string()
  .required("No password provided.")
  .min(8, "Password is too short - should be 8 chars minimum.")
  .matches(/[a-zA-Z]\w{3,14}/, "Password can only contain Latin letters.");

const email = yup
  .string()
  .email("Should be email")
  .required("No email provided.");

const username = yup
  .string()
  .matches(/^[_A-z0-9]/)
  .required("No username provided.");

export const registerSchema = yup.object().shape({
  password,
  email,
  username,
});

export const loginSchema = yup.object().shape({
  password,
  email,
});
