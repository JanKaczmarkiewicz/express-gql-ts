import User from "../../models/user.model";
import { Resolvers } from "../../types/types";

export const resolvers: Resolvers = {
  Query: {
    user: async (_, { id }) => User.findOne({ id }),
    users: async (_, {}) => {
      return await User.find();
    },
  },
};
