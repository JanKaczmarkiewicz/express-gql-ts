import { request } from "../../testUtils/request";
import User from "../../models/User.model";

const user = {
  email: "test@testdomain.com",
  password: "Sdasdasdafa",
  username: "TestUser",
};

const createUserGQL = `
mutation{
  register(email:"${user.email}", password:"${user.password}", username:"${user.username}")
}
`;

test("Registered user should be saved in database.", async () => {
  const response = await request(createUserGQL);
  console.log(response);
  expect(response.data.register).not.toBe(null);

  const foundUsers = await User.find({ email: user.email });
  expect(foundUsers).toHaveLength(1);
  const foundUser = foundUsers[0];
  expect(foundUser.username).toBe(user.username);
  expect(foundUser.password).not.toBe(user.password);
  expect(foundUser.email).toBe(user.email);
});
