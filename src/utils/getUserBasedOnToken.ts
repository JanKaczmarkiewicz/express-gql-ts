import { verifyAuthToken } from "./authToken";
import { User as IUser } from "../types/types";
import User from "../models/user.model";

const getUserBasedOnToken = async (token: string): Promise<IUser | null> => {
  const tokenData = verifyAuthToken(token);

  if (!tokenData) return null;

  const foundUser = await User.findOne({
    _id: tokenData.id,
  });

  if (!foundUser) return null;

  return foundUser;
};

export default getUserBasedOnToken;
