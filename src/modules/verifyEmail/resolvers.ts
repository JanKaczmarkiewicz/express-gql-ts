import { AuthenticationError, ForbiddenError } from "apollo-server-core";
import { Resolvers } from "../../types/types";

import User from "../../models/user.model";
import { verifyConfirmingToken } from "../../utils/confirmingToken";

export const resolvers: Resolvers = {
  Mutation: {
    verifyEmail: async (_, { token }) => {
      const userId = verifyConfirmingToken(token);

      if (!userId) {
        throw new ForbiddenError("Bad confirming token");
      }

      const foundUser = await User.findOne({ _id: userId });

      if (!foundUser) {
        throw new AuthenticationError("User not exists");
      }

      const { confirmed } = await foundUser.update({ confirmed: true });

      return confirmed;
    },
  },
};
