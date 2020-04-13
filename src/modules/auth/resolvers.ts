import * as bcrypt from "bcryptjs";

import { IResolvers } from "graphql-tools";
import { AuthenticationError } from "apollo-server-core";
import { MutationRegisterArgs } from "../../types/types";

import User from "../../models/user.model";

import { validateToken } from "../../utils/validateToken";
import { signToken } from "../../utils/signToken";

export const resolvers: IResolvers = {
  Query: {
    me: async (_, __, context) => {
      const userId = await validateToken(context);

      if (!userId) return new AuthenticationError("Bad token.");

      const user = await User.findOne({ _id: userId });

      return user;
    },
  },
  Mutation: {
    register: async (
      _,
      { email, password, username }: MutationRegisterArgs
    ) => {
      const foundUsers = await User.find({ $or: [{ username }, { email }] });

      if (foundUsers.length > 0) {
        return new Error("User aready exist!");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const savedUser = await new User({
        username,
        email,
        password: hashedPassword,
      }).save();

      return signToken(savedUser.id);
    },
    login: async (_, { email, password }: MutationRegisterArgs) => {
      const foundUser = await User.findOne({ email });

      if (!foundUser) return new AuthenticationError("Invalid email or login!");

      const isPasswordCorrect = await bcrypt.compare(
        password,
        foundUser.password
      );

      if (!isPasswordCorrect)
        return new AuthenticationError("Invalid email or login!");

      return signToken(foundUser.id);
    },
  },
};
