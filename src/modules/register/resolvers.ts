import * as bcrypt from "bcryptjs";
import { ForbiddenError } from "apollo-server-core";
import { Resolvers } from "../../types/types";

import User from "../../models/user.model";

import { signAuthToken } from "../../utils/authToken";

import { sendConfirmingEmail } from "../../utils/sendConfirmingEmail";
import { signConfirmingToken } from "../../utils/confirmingToken";
import { responceError } from "../../errors/responce";

export const resolvers: Resolvers = {
  Mutation: {
    register: async (_, { password, username, email }) => {
      const foundUsers = await User.find({ $or: [{ username }, { email }] });

      if (foundUsers.length > 0)
        throw new ForbiddenError(responceError.userExists);

      const hashedPassword = await bcrypt.hash(password, 10);

      const savedUser = await new User({
        username,
        email,
        password: hashedPassword,
        confirmed: false,
      }).save();

      const confirmingToken = signConfirmingToken({ id: savedUser.id });
      sendConfirmingEmail(confirmingToken, savedUser);

      const authToken: string = signAuthToken({ id: savedUser.id });
      return authToken;
    },
  },
};
