import { IResolvers } from "graphql-tools";
import * as bcryptjs from "bcryptjs";
import { MutationRegisterArgs } from "../../types/types";
import User from "../../models/user.model";

export const resolvers: IResolvers = {
  Query: {
    loggedUser: (_) => "user",
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

      return savedUser.password;
    },
  },
};
