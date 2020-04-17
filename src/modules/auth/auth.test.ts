import createServer from "../../server/createServer";
import { createTestClient } from "apollo-server-testing";
import { removeAllCollections } from "../../testUtils/connectToMongoose";
import createDatabaseConnection from "../../db/connect";
import User from "../../models/User.model";
import gql from "graphql-tag";
import { ME, REGISTER } from "../../testUtils/queries";

beforeAll(async () => {
  await createDatabaseConnection();
  await removeAllCollections();
});

const dummyUserData = {
  // email: "test@testdomain.com",
  email: "jan.michal.kaczmarkiewicz@gmail.com",
  password: "Sdasdasdafa",
  username: "TestUser",
};

let token: string | null;

describe("Register", () => {
  const { query } = createTestClient(createServer());

  it("Response should returns token", async () => {
    const res = await query({ query: REGISTER, variables: dummyUserData });
    console.log(res);
    token = res.data?.register;
    expect(token).toBeTruthy();
    const foundUsers = await User.find({ email: dummyUserData.email });

    expect(foundUsers).toHaveLength(1);
    const foundUser = foundUsers[0];
    expect(foundUser.username).toBe(dummyUserData.username);
    expect(foundUser.password).not.toBe(dummyUserData.password);
    expect(foundUser.email).toBe(dummyUserData.email);
  });

  it("Same user cannot be registered twice.", async () => {
    const res = await query({
      query: "register",
      variables: dummyUserData,
    });
    expect(res.data?.register).toBe(null);
  });
});

describe("Me", () => {
  const { query } = createTestClient(createServer({ token }));

  it("With valid token should returns user data.", async () => {
    const res = await query({ query: ME });
    const user = res.data?.me;
    expect(user).not.toBe(null);
    expect(user.username).toBe(dummyUserData.username);
    expect(user.password).toBe(undefined);
  });
  it("With invalid token result in null.", async () => {
    const response = await request(meGQL, "bad_token");
    const user = response.data;
    expect(user).toBe(null);
  });
});

// const loginGQL = (email: string, password: string) => `
// mutation{
//   login(email: "${email}", password: "${password}")
// }`;

// describe("Login", () => {
//   it("should returns token if credensials valid", async () => {
//     const goodLoginGQL = loginGQL(dummyUserData.email, dummyUserData.password);

//     const response0 = await query(goodLoginGQL);
//     expect(response0.data.login).not.toBe(null);
//   });

//   it("should returns token if credensials invalid", async () => {
//     const badLoginGQL = loginGQL("Bad email", "Bad password");

//     const res = await query({ query: GET_LAUNCH, variables: { id: 1 } });
//     expect(response1.data.login).toBe(null);
//   });
// });
