import { MutationRegisterArgs } from "../../types/types";
import { query } from "../query";
import { REGISTER, VERIFY_EMAIL, LOGIN, ME } from "../queries";
import { authTokenToVerificationToken } from "../../utils/authTokenToVerificationToken";

export const symulateAuth = (userData: MutationRegisterArgs) => {
  const stack: Function[] = [];

  const execute = async () =>
    <any>(
      stack
        .reduce(
          (promise, callback: any) => promise.then(callback),
          Promise.resolve()
        )
        .catch(console.error)
    );

  const register = () => {
    stack.push(() =>
      query({ query: REGISTER, variables: userData }).then(
        (res) => res.data?.register
      )
    );
    return { verifyEmail, login, execute };
  };

  const verifyEmail = () => {
    stack.push((authToken: string) => {
      const verificationToken = authTokenToVerificationToken(authToken);

      return query({
        query: VERIFY_EMAIL,
        variables: { token: verificationToken },
      }).then((res) => res.data?.verifyEmail);
    });

    return { login, execute };
  };

  const login = () => {
    stack.push(() =>
      query({
        query: LOGIN,
        variables: { email: userData.email, password: userData.password },
      }).then((res) => res.data?.login)
    );

    return { me, execute };
  };

  const me = () => {
    stack.push((authToken: string) =>
      query(
        {
          query: ME,
          variables: { email: userData.email, password: userData.password },
        },
        authToken
      ).then((res) => res.data?.me)
    );

    return { execute };
  };

  return { register };
};
