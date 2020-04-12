import * as jwt from "jsonwebtoken";
import * as mongoose from "mongoose";

/**
 * @param context Graphql context
 * @returns (in Promise) user id contained in jwt token, or false in case of bad token
 */
export const validateToken = async (context: any): Promise<string | null> => {
  const bearerToken: string | undefined =
    context?.request?.headers?.authorization;

  if (!bearerToken) return null;

  const token = bearerToken.split(" ")[1];

  const userId = jwt.verify(token, process.env.JWT_SECRET as string) as string;

  const foundUser = await mongoose.models.User.findOne({ _id: userId });

  if (!foundUser) return null;

  return foundUser._id;
};
