import { IResolvers } from "graphql-tools";
import * as bcryptjs from "bcryptjs";
import { MutationRegisterArgs } from "../../types/types";
import User from "../../models/user.model";
import { validateToken } from "../../utils/validateToken";
import { AuthenticationError } from "apollo-server-core";

export const resolvers: IResolvers = {
  Query: {
    loggedUser: (_) => "user",
  },
  Mutation: {
    register: async (
      _,
      { email, password, username }: MutationRegisterArgs,
      context
    ) => {
      const userId = await validateToken(context);
      if (!userId) return new AuthenticationError("Bad token.");

      const hashedPassword = await bcryptjs.hash(password, 10);

      const savedUser = await new User({
        username,
        email,
        password: hashedPassword,
      }).save();

      return savedUser.password;
    },
  },
};
