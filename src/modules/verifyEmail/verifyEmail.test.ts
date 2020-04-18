// import createDatabaseConnection from "../../db/connect";
// import { removeAllCollections } from "../../testUtils/connectToMongoose";
// import { VERIFY_EMAIL } from "../../testUtils/queries";
// import { dummyUser } from "../../testUtils/dummyUser";
// import { query } from "../../testUtils/query";
// import { symulateAuth } from "../../testUtils/symulations/symulateAuth";

// beforeAll(async () => {
//   await createDatabaseConnection();
// });

// describe("Login", () => {
//   let verificationToken: string;

//   beforeAll(async () => {
//     await removeAllCollections();
//     await symulateAuth(dummyUser).register().execute();
//   });

//   it("should returns token if credensials valid", async () => {
//     const res = await query({
//       query: VERIFY_EMAIL,
//       variables: {
//         token: verificationToken,
//       },
//     });

//     expect(res.data?.login).toBeTruthy();
//   });

//   it("should return null if there is no user with this email", async () => {
//     const res = await query({
//       query: LOGIN,
//       variables: {
//         email: "bad_user_email@test.com",
//         password: dummyUser.password,
//       },
//     });

//     expect(res.data?.login).toBeFalsy();
//   });

//   it("should return null if password invalid", async () => {
//     const res = await query({
//       query: LOGIN,
//       variables: {
//         email: dummyUser.email,
//         password: "bad_user_password",
//       },
//     });

//     expect(res.data?.login).toBeFalsy();
//   });
// });
