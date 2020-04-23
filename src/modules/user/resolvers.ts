import User from "../../models/user.model";
import { Resolvers } from "../../types/types";

export const resolvers: Resolvers = {
  Query: {
    user: async (_, { id }) => User.findOne({ _id: id }),
    users: async (_, {}) => User.find(),
  },
};
