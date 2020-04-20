import createDatabaseConnection from "../../db/connect";
import { removeAllCollections } from "../../testUtils/connectToMongoose";
import { REGISTER } from "../../testUtils/queries";
import { dummyUser } from "../../testUtils/dummyUser";
import { query } from "../../testUtils/query";
import User from "../../models/user.model";

beforeAll(async () => {
  await createDatabaseConnection();
  await removeAllCollections();
});

describe("Register", () => {
  it("Response should returns token", async () => {
    const res = await query({ query: REGISTER, variables: dummyUser });

    const token = res.data?.register;
    expect(token).toBeTruthy();
    const foundUsers = await User.find({ email: dummyUser.email });

    expect(foundUsers).toHaveLength(1);
    const foundUser = foundUsers[0];
    expect(foundUser.username).toBe(dummyUser.username);
    expect(foundUser.password).not.toBe(dummyUser.password);
    expect(foundUser.email).toBe(dummyUser.email);
  });

  it("Same user cannot be registered twice.", async () => {
    const res = await query({ query: REGISTER, variables: dummyUser });
    expect(res.data?.register).toBeFalsy();
  });
});
