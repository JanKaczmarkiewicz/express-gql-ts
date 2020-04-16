import * as bcrypt from "bcryptjs";
import {
  AuthenticationError,
  UserInputError,
  ForbiddenError,
} from "apollo-server-core";
import { Resolvers } from "../../types/types";

import User from "../../models/user.model";

import { verifyAuthToken, signAuthToken } from "../../utils/authToken";
import { verifyConfirmingToken } from "../../utils/confirmingToken";

import { registerSchema } from "./validators";
import { validateArgs } from "../../utils/validateArgs";
import { sendConfirmingEmail } from "../../utils/sendConfirmingEmail";

export const resolvers: Resolvers = {
  Query: {
    me: async (_, __, context) => {
      const userId = await verifyAuthToken(context);

      if (!userId) throw new ForbiddenError("Bad token.");

      const user = await User.findOne({ id: userId });

      if (!user) throw new ForbiddenError("Not found.");

      return user;
    },
  },
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
    login: async (_, { email, password }) => {
      const foundUser = await User.findOne({ email });

      if (!foundUser) throw new AuthenticationError("Invalid email or login");

      const isPasswordCorrect = await bcrypt.compare(
        password,
        foundUser.password
      );

      if (!isPasswordCorrect)
        throw new AuthenticationError("Invalid email or login");

      return signAuthToken({ id: foundUser.id });
    },
    verifyEmail: async (_, { token }) => {
      const userId = verifyConfirmingToken(token);

      if (!userId) {
        throw new ForbiddenError("Bad confirming token");
      }

      const foundUser = await User.findOne({ id: userId });

      if (!foundUser) {
        throw new AuthenticationError("User not exists");
      }

      const { confirmed } = await foundUser.update({ confirmed: true });

      return confirmed;
    },
  },
};
