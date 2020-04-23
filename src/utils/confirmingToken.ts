import * as jwt from "jsonwebtoken";
import { TokenData } from "../types/util";

const expiresIn = 12 * 60 * 60;

export const signConfirmingToken = (tokenData: TokenData): string =>
  jwt.sign(tokenData, process.env.JWT_CONFIRM_SECRET as string, {
    expiresIn,
  });

export const verifyConfirmingToken = (token: string): string | null => {
  try {
    const { id } = jwt.verify(
      token,
      process.env.JWT_CONFIRM_SECRET as string
    ) as { id: string };
    return id;
  } catch {
    return null;
  }
};
