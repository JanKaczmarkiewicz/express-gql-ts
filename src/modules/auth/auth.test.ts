import { request } from "../../testUtils/request";
import User from "../../models/User.model";

const dummyUserData = {
  email: "test@testdomain.com",
  password: "Sdasdasdafa",
  username: "TestUser",
};

let token: string;

describe("Register", () => {
  const createUserGQL = `
  mutation{
    register(email:"${dummyUserData.email}", password:"${dummyUserData.password}", username:"${dummyUserData.username}")
  }
  `;
  it("Response should returns token", async () => {
    const response = await request(createUserGQL);
    token = response.data.register;
    expect(token).toBeTruthy();
    const foundUsers = await User.find({ email: dummyUserData.email });
    expect(foundUsers).toHaveLength(1);
    const foundUser = foundUsers[0];
    expect(foundUser.username).toBe(dummyUserData.username);
    expect(foundUser.password).not.toBe(dummyUserData.password);
    expect(foundUser.email).toBe(dummyUserData.email);
  });

  it("Same user cannot be registered twice.", async () => {
    const response0 = await request(createUserGQL);
    expect(response0.data.register).toBe(null);
  });
});

describe("Me", () => {
  const meGQL = `
  query{
    me{
      username
      email
      id
    }
  }`;
  it("With valid token should returns user data.", async () => {
    const response = await request(meGQL, token);
    const user = response.data.me;
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

const loginGQL = (email: string, password: string) => `
mutation{
  login(email: "${email}", password: "${password}")
}`;

describe("Login", () => {
  it("should returns token if credensials valid", async () => {
    const goodLoginGQL = loginGQL(dummyUserData.email, dummyUserData.password);

    const response0 = await request(goodLoginGQL);
    expect(response0.data.login).not.toBe(null);
  });

  it("should returns token if credensials invalid", async () => {
    const badLoginGQL = loginGQL("Bad email", "Bad passsword");

    const response1 = await request(badLoginGQL);
    expect(response1.data.login).toBe(null);
  });
});
