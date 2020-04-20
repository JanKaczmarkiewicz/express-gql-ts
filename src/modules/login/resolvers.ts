import * as bcrypt from "bcryptjs";
import { Resolvers } from "../../types/types";
import User from "../../models/user.model";
import { AuthenticationError } from "apollo-server";
import { signAuthToken } from "../../utils/authToken";

export const resolvers: Resolvers = {
  Mutation: {
    login: async (_, { email, password }) => {
      const foundUser = await User.findOne({ email });

      if (!foundUser) throw new AuthenticationError("Invalid email or login");

      const isPasswordCorrect = await bcrypt.compare(
        password,
        foundUser.password
      );

      if (!isPasswordCorrect)
        throw new AuthenticationError("Invalid email or login");

      return signAuthToken({ id: foundUser.id });
    },
  },
};
