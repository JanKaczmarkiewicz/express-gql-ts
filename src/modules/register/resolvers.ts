import * as bcrypt from "bcryptjs";
import { UserInputError, ForbiddenError } from "apollo-server-core";
import { Resolvers } from "../../types/types";

import User from "../../models/user.model";

import { signAuthToken } from "../../utils/authToken";

import { registerSchema } from "../../validators/validators";
import { validateArgs } from "../../utils/validateArgs";
import { sendConfirmingEmail } from "../../utils/sendConfirmingEmail";
import { signConfirmingToken } from "../../utils/confirmingToken";

export const resolvers: Resolvers = {
  Mutation: {
    register: async (_, args) => {
      const { password, username, email } = args;

      const validationErrors = await validateArgs(registerSchema, args);
      if (validationErrors.length > 0) {
        throw new UserInputError("Register failed due to validation errors", {
          validationErrors,
        });
      }

      const foundUsers = await User.find({ $or: [{ username }, { email }] });

      if (foundUsers.length > 0) {
        throw new ForbiddenError("User aready exist");
      }

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
