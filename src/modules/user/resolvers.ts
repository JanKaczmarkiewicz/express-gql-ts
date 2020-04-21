import { IResolvers } from "graphql-tools";

import User from "../../models/user.model";

export const resolvers: IResolvers = {
  Query: {
    user: async (_, { id }) => {
      const user = await User.findOne({ id });
      return user ? user : null;
    },
    users: async (_, {}) => {
      return await User.find();
    },
  },
};
