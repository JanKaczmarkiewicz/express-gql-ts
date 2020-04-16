import { request } from "../../testUtils/request";
import User from "../../models/User.model";
import { dummyUserData } from "../../testUtils/userData";

let token: string;

const loginGQL = (email: string, password: string) => `
mutation{
  login(email: "${email}", password: "${password}")
}`;

describe("Get single user", () => {
  const userGQL = (id: string) => `
  query{
    user(id: "${id}"){
      id
      username
    }
  }`;

  const meGQL = `
  query{
    me{
      username
      email
      id
    }
  }`;

  it("If valid id should returns user data.", async () => {
    const goodLoginGQL = loginGQL(dummyUserData.email, dummyUserData.password);

    token = await request(goodLoginGQL);
    const { id } = await request(meGQL));

    const result = await request(userGQL(id), token);
    console.log(result);
  });
});
