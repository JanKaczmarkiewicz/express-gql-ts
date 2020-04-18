import { ForbiddenError } from "apollo-server-core";
import { Resolvers } from "../../types/types";

export const resolvers: Resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new ForbiddenError("Provide a token.");
      return user;
    },
  },
};
