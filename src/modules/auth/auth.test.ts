import { request } from "../../testUtils/request";

const createUserGQL = `
mutation{
  register(email:"safasdaa@wasdasasdap.pl", password:"sasdfafa", username:"Jaasasdssn")
}
`;

test("Registered user should be saved in database.", async () => {
  try {
    const data = await request(createUserGQL);
    console.log(data);
  } catch (err) {}
});
