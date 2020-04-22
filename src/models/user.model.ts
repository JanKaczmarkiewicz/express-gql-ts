import * as mongoose from "mongoose";
import { UserDbObject } from "../types/types";

import { Role } from "../types/types";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmed: { type: Boolean, default: false },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  role: {
    type: String,
    enum: Object.values(Role),
    default: Role.User,
  },
});

const User = mongoose.model<UserDbObject & mongoose.Document>(
  "User",
  userSchema
);

export default User;
