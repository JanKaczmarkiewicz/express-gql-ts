import * as jwt from "jsonwebtoken";
import { TokenData } from "../types/util";

const secret = process.env.JWT_AUTH_SECRET as string;

export const signAuthToken = (tokenData: TokenData): string =>
  jwt.sign(tokenData, secret as string);

/**
 * @param context Graphql context
 * @returns (in Promise) TokenData contained in jwt token, or false in case of bad token
 */
export const verifyAuthToken = (bearerToken: string): TokenData | null => {
  const token = bearerToken.split(" ")[1];
  try {
    return jwt.verify(token, secret) as TokenData;
  } catch (error) {
    return null;
  }
};
