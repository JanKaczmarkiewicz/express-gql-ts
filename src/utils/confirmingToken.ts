import * as jwt from "jsonwebtoken";
import { TokenData } from "../types/util";

const secret = process.env.JWT_CONFIRM_SECRET as string;
const expiresIn = 12 * 60 * 60;

export const signConfirmingToken = (tokenData: TokenData): string =>
  jwt.sign(tokenData, secret, {
    expiresIn,
  });

export const verifyConfirmingToken = (token: string): string | null => {
  try {
    const { id } = jwt.verify(token, secret) as { id: string };
    return id;
  } catch {
    return null;
  }
};
