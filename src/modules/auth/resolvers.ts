import * as bcrypt from "bcryptjs";
import { IResolvers } from "graphql-tools";
import {
  AuthenticationError,
  UserInputError,
  ForbiddenError,
} from "apollo-server-core";
import { MutationRegisterArgs } from "../../types/types";

import User from "../../models/user.model";

import { validateToken } from "../../utils/validateToken";
import { signToken } from "../../utils/signToken";
import { registerSchema } from "./validators";
import { validateArgs } from "../../utils/validateArgs";

export const resolvers: IResolvers = {
  Query: {
    me: async (_, __, context) => {
      const userId = await validateToken(context);

      if (!userId) return new ForbiddenError("Bad token.");

      const user = await User.findOne({ _id: userId });

      return user;
    },
  },
  Mutation: {
    register: async (_, args: MutationRegisterArgs) => {
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
      }).save();

      return signToken(savedUser.id);
    },
    login: async (_, { email, password }: MutationRegisterArgs) => {
      const foundUser = await User.findOne({ email });

      if (!foundUser) return new AuthenticationError("Invalid email or login");

      const isPasswordCorrect = await bcrypt.compare(
        password,
        foundUser.password
      );

      if (!isPasswordCorrect)
        return new AuthenticationError("Invalid email or login");

      return signToken(foundUser.id);
    },
  },
};
