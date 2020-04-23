import * as bcrypt from "bcryptjs";
import { Resolvers } from "../../types/types";
import User from "../../models/user.model";
import { AuthenticationError } from "apollo-server";
import { signAuthToken } from "../../utils/authToken";
import { responceError } from "../../errors/responce";

export const resolvers: Resolvers = {
  Mutation: {
    login: async (_, { email, password }) => {
      const foundUser = await User.findOne({ email });

      if (!foundUser)
        throw new AuthenticationError(responceError.invalidCredentials);

      const isPasswordCorrect = await bcrypt.compare(
        password,
        foundUser.password
      );

      if (!isPasswordCorrect)
        throw new AuthenticationError(responceError.invalidCredentials);

      return signAuthToken({ id: foundUser.id });
    },
  },
};
