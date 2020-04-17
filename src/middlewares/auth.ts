import { verifyAuthToken } from "../utils/authToken";
import { User as IUser } from "../types/types";
import User from "../models/User.model";

const authMiddleware = async (
  token: string | undefined
): Promise<IUser | null> => {
  if (!token) return null;

  const tokenData = verifyAuthToken(token);

  if (!tokenData) return null;

  const foundUser = await User.findOne({
    _id: tokenData.id,
  });

  if (!foundUser) return null;

  return foundUser;
};

export default authMiddleware;
