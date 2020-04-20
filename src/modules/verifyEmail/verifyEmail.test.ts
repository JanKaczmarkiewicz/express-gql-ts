import createDatabaseConnection from "../../db/connect";
import { removeAllCollections } from "../../testUtils/connectToMongoose";
import { VERIFY_EMAIL } from "../../testUtils/queries";
import { dummyUser } from "../../testUtils/dummyUser";
import { query } from "../../testUtils/query";
import { symulateAuth } from "../../testUtils/symulations/symulateAuth";
import { authTokenToVerificationToken } from "../../utils/authTokenToVerificationToken";

let verificationToken: string;

beforeAll(async () => {
  await createDatabaseConnection();
  await removeAllCollections();

  const authToken = await symulateAuth(dummyUser).register().execute();
  verificationToken = authTokenToVerificationToken(authToken);
});

describe("Login", () => {
  it("should returns true if verificationToken valid", async () => {
    const res = await query({
      query: VERIFY_EMAIL,
      variables: {
        token: verificationToken,
      },
    });

    expect(res.data?.verifyEmail).toBeTruthy();
  });

  it("should returns false if verificationToken invalid", async () => {
    const res = await query({
      query: VERIFY_EMAIL,
      variables: {
        token: "Wrong token",
      },
    });

    expect(res.data?.verifyEmail).toBeFalsy();
  });

  it("should returns false if authToken is passed as verificationToken.", async () => {
    const authToken = await symulateAuth(dummyUser).register().execute();
    const res = await query({
      query: VERIFY_EMAIL,
      variables: {
        token: authToken,
      },
    });

    expect(res.data?.verifyEmail).toBeFalsy();
  });
});
