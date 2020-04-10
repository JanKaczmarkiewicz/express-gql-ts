import { IResolvers } from "graphql-tools";
import { MutationRegisterArgs } from "../../types";

export const resolvers: IResolvers = {
  Query: {
    loggedUser: (_) => "user",
  },
  Mutation: {
    register: (_, { email, password }: MutationRegisterArgs) => {
      email;
      password;
      return "token";
    },
  },
};
