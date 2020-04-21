import { ApolloServer } from "apollo-server";

import importModulesSchemas from "../utils/importModulesSchemas";
import getUserBasedOnToken from "../utils/getUserBasedOnToken";
import { Context, ServerOptions } from "../types/util";

const { resolvers, typeDefs, directives } = importModulesSchemas();

export default (options?: ServerOptions) => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    schemaDirectives: directives,
    context: async (expressContext) => {
      const token: string | undefined =
        expressContext.req?.headers.authorization ?? options?.token;

      const user = token ? await getUserBasedOnToken(token) : null;
      return {
        req: expressContext.req,
        res: expressContext.res,
        user,
      } as Context;
    },
  });

  return server;
};
