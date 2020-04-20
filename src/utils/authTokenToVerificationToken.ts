import { verifyAuthToken } from "./authToken";
import { signConfirmingToken } from "./confirmingToken";

export const authTokenToVerificationToken = (authToken: string) => {
  const userId = verifyAuthToken(`Bearer ${authToken}`)?.id;
  return signConfirmingToken({ id: userId ?? "" });
};
