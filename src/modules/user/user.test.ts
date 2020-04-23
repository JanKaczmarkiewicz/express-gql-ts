import createDatabaseConnection from "../../db/connect";
import { removeAllCollections } from "../../testUtils/connectToMongoose";
import { USER, USERS } from "../../testUtils/queries";
import { dummyUser, secondDummyUser } from "../../testUtils/dummyUser";
import { query } from "../../testUtils/query";
import { symulateAuth } from "../../testUtils/symulations/symulateAuth";
import { User } from "../../types/types";

let token: string;
let secondUserData: User;

beforeAll(async () => {
  await createDatabaseConnection();
  await removeAllCollections();
  token = await symulateAuth(dummyUser)
    .register()
    .verifyEmail()
    .login()
    .execute();

  secondUserData = await symulateAuth(secondDummyUser)
    .register()
    .verifyEmail()
    .login()
    .me()
    .execute();
});

describe("User", () => {
  it("Authenticated user should have access to find user by id", async () => {
    const res = await query(
      { query: USER, variables: { id: secondUserData._id } },
      token
    );
    const user = res.data?.user;

    expect(user.username).toBe(secondUserData.username);
    expect(user.email).toBe(secondUserData.email);
  });
  it("Invalid id argument results in null.", async () => {
    const res = await query(
      { query: USER, variables: { id: "bad_id" } },
      token
    );
    const user = res.data?.user;
    expect(user).toBeFalsy();
  });
});

describe("Users", () => {
  it("Authenticated user should have access to find multiple users", async () => {
    const res = await query(
      { query: USERS, variables: { id: secondUserData._id } },
      token
    );
    const users = res.data?.users;
    expect(users).toHaveLength(2);
  });
  it("Inauthenticated user shouldn't have access to user to userdata.", async () => {
    const res = await query(
      { query: USERS, variables: { id: "bad_id" } },
      token
    );
    const user = res.data?.user;
    expect(user).toBeFalsy();
  });
});
