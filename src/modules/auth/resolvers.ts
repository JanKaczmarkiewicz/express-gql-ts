import { IResolvers } from "graphql-tools";
import { MutationRegisterArgs } from "../../types/types";
import User from "../../models/user.model";

export const resolvers: IResolvers = {
  Query: {
    loggedUser: (_) => "user",
  },
  Mutation: {
    register: async (_, { email, password, name }: MutationRegisterArgs) => {
      const savedUser = await new User({
        name,
        email,
        password,
      }).save();
      console.log("User created: ", savedUser);

      return "User created";
    },
  },
};
