import createDatabaseConnection from "../../db/connect";

import { removeAllCollections } from "../../testUtils/connectToMongoose";
import User from "../../models/user.model";

import { query } from "../../testUtils/query";
import { REGISTER, LOGIN, ME } from "../../testUtils/queries";

const dummyUser = {
  email: "tets2@gmail.com",
  username: "Test2",
  password: "password123",
};

beforeAll(async () => {
  await createDatabaseConnection();
});

describe("Register", () => {
  beforeAll(async () => {
    await removeAllCollections();
  });

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

describe("Me", () => {
  let token: string;

  beforeAll(async () => {
    await removeAllCollections();
    const res = await query({
      query: REGISTER,
      variables: dummyUser,
    });
    token = res.data?.register;
  });

  it("With valid token should returns user data.", async () => {
    const res = await query({ query: ME }, token);
    const user = res.data?.me;
    expect(user.username).toBe(dummyUser.username);
  });
  it("With invalid token result in null.", async () => {
    const res = await query({ query: ME });
    const user = res.data;
    expect(user).toBeFalsy();
  });
});

describe("Login", () => {
  beforeAll(async () => {
    await removeAllCollections();
    await query({
      query: REGISTER,
      variables: dummyUser,
    });
  });

  it("should returns token if credensials valid", async () => {
    const res = await query({
      query: LOGIN,
      variables: {
        email: dummyUser.email,
        password: dummyUser.password,
      },
    });
    console.log(res);

    expect(res.data?.login).toBeTruthy();
  });

  it("should return null if there is no user with this email", async () => {
    const res = await query({
      query: LOGIN,
      variables: {
        email: "bad_user_email@test.com",
        password: dummyUser.password,
      },
    });

    expect(res.data?.login).toBeFalsy();
  });

  it("should return null if password invalid", async () => {
    const res = await query({
      query: LOGIN,
      variables: {
        email: dummyUser.email,
        password: "bad_user_password",
      },
    });

    expect(res.data?.login).toBeFalsy();
  });
});
