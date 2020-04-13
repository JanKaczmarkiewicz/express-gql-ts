import { request } from "../../testUtils/request";
import User from "../../models/User.model";

const dummyUserData = {
  email: "test@testdomain.com",
  password: "Sdasdasdafa",
  username: "TestUser",
};

const createUserGQL = `
mutation{
  register(email:"${dummyUserData.email}", password:"${dummyUserData.password}", username:"${dummyUserData.username}")
}
`;

let token: string;

test("Registered user should be saved in database.", async () => {
  const response = await request(createUserGQL);
  token = response.data.register;
  expect(token).not.toBe(null);

  const foundUsers = await User.find({ email: dummyUserData.email });
  expect(foundUsers).toHaveLength(1);
  const foundUser = foundUsers[0];
  expect(foundUser.username).toBe(dummyUserData.username);
  expect(foundUser.password).not.toBe(dummyUserData.password);
  expect(foundUser.email).toBe(dummyUserData.email);
});

const meGQL = `
query{
  me{
    username
    email
    id
  }
}`;

test("Me query with token should returns userData.", async () => {
  const response0 = await request(meGQL, token);
  const user = response0.data.me;
  expect(user).not.toBe(null);
  expect(user.username).toBe(dummyUserData.username);
  expect(user.password).toBe(undefined);

  const response1 = await request(meGQL, "bad_token");
  const user1 = response1.data;
  expect(user1).toBe(null);
});
