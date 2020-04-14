import * as mongoose from "mongoose";
import * as jwt from "jsonwebtoken";
import { TokenData } from "../types/util";

// const algorithm = "RS256";
const secret = process.env.JWT_AUTH_SECRET as string;

export const signAuthToken = (tokenData: TokenData): string =>
  jwt.sign(tokenData, secret as string);

/**
 * @param context Graphql context
 * @returns (in Promise) user id contained in jwt token, or false in case of bad token
 */
export const verifyAuthToken = async (context: any): Promise<string | null> => {
  const bearerToken: string | undefined =
    context?.request?.headers?.authorization;

  if (!bearerToken) return null;

  const token = bearerToken.split(" ")[1];
  let userId: string;
  try {
    const { id } = jwt.verify(token, secret) as TokenData;

    userId = id;
  } catch (error) {
    return null;
  }

  const foundUser = await mongoose.models.User.findOne({ _id: userId });

  if (!foundUser) return null;

  return foundUser._id;
};
