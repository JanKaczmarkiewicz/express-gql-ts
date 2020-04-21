export const passwordError = {
  required: "No password provided.",
  min: (min: number) =>
    `Password is too short - should be ${min} chars minimum.`,
  format: "Password can only contain Latin letters.",
};

export const emailError = {
  format: "Should be email",
  required: "No email provided.",
};

export const usernameError = {
  format: "Username may contain A-z 0-9 chars.",
  required: "No username provided.",
};
