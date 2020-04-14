import * as jwt from "jsonwebtoken";
import { TokenData } from "../types/util";

// const algorithm = "RS256";
const secret = process.env.JWT_CONFIRM_SECRET as string;
const expiresIn = 1000;

export const verifyConfirmingToken = (token: string): string | null => {
  try {
    const { id } = jwt.verify(token, secret) as { id: string };

    return id;
  } catch {
    return null;
  }
};

export const signConfirmingToken = (tokenData: TokenData): string => {
  return jwt.sign(tokenData, secret, {
    expiresIn,
  });
};
