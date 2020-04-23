import * as jwt from "jsonwebtoken";
import { TokenData } from "../types/util";

export const signAuthToken = (tokenData: TokenData): string =>
  jwt.sign(tokenData, process.env.JWT_AUTH_SECRET as string);

export const verifyAuthToken = (bearerToken: string): TokenData | null => {
  const token = bearerToken.split(" ")[1];
  try {
    return jwt.verify(
      token,
      process.env.JWT_AUTH_SECRET as string
    ) as TokenData;
  } catch (error) {
    return null;
  }
};
