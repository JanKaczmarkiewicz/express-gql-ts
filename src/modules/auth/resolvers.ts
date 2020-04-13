import * as bcryptjs from "bcryptjs";

import { IResolvers } from "graphql-tools";
// import { AuthenticationError } from "apollo-server-core";
import { MutationRegisterArgs } from "../../types/types";

import User from "../../models/user.model";

import { validateToken } from "../../utils/validateToken";
import { signToken } from "../../utils/signToken";
import { AuthenticationError } from "apollo-server-core";

export const resolvers: IResolvers = {
  Query: {
    me: async (_, __, context) => {
      const userId = await validateToken(context);
      console.log(userId);
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
      const hashedPassword = await bcryptjs.hash(password, 10);

      const savedUser = await new User({
        username,
        email,
        password: hashedPassword,
      }).save();

      return signToken(savedUser.id);
    },
  },
};
