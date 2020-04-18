import createDatabaseConnection from "../../db/connect";
import { removeAllCollections } from "../../testUtils/connectToMongoose";
import { ME } from "../../testUtils/queries";
import { dummyUser } from "../../testUtils/dummyUser";
import { query } from "../../testUtils/query";
import { symulateAuth } from "../../testUtils/symulations/symulateAuth";

beforeAll(async () => {
  await createDatabaseConnection();
});

describe("Me", () => {
  let token: string;

  beforeAll(async () => {
    await removeAllCollections();
    token = await symulateAuth(dummyUser)
      .register()
      .verifyEmail()
      .login()
      .execute();
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
