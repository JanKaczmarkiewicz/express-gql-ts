import * as jwt from "jsonwebtoken";

export const signToken = async (userId: string): Promise<string> =>
  jwt.sign(userId, process.env.JWT_SECRET as string);
