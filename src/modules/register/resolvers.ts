import * as bcrypt from "bcryptjs";
import { UserInputError, ForbiddenError } from "apollo-server-core";
import { Resolvers } from "../../types/types";

import User from "../../models/user.model";

import { signAuthToken } from "../../utils/authToken";

import { registerSchema } from "../../validators/validators";
import { validateArgs } from "../../utils/validateArgs";
import { sendConfirmingEmail } from "../../utils/sendConfirmingEmail";

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

      await sendConfirmingEmail(savedUser as any);

      return signAuthToken({ id: savedUser.id });
    },
  },
};
