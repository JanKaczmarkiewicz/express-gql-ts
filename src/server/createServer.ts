import { ApolloServer, gql } from "apollo-server";
import { DIRECTIVES } from "@graphql-codegen/typescript-mongodb";

import importModulesSchemas from "../utils/importModulesSchemas";
import getUserBasedOnToken from "../utils/getUserBasedOnToken";
import { Context, ServerOptions } from "../types/util";
const { resolvers, typeDefs } = importModulesSchemas();

export default (options?: ServerOptions) => {
  const server = new ApolloServer({
    resolvers,
    typeDefs: [gql(typeDefs), DIRECTIVES],
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
