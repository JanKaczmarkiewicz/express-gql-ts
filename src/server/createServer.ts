import { ApolloServer, gql } from "apollo-server";
import importModulesSchemas from "../utils/importModulesSchemas";
import { DIRECTIVES } from "@graphql-codegen/typescript-mongodb";
import authMiddleware from "../middlewares/auth";
import { Context } from "../types/util";

interface CustomContext {
  token?: string;
}

export default (customContext?: CustomContext) => {
  const { resolvers, typeDefs } = importModulesSchemas();

  const server = new ApolloServer({
    resolvers,
    typeDefs: [gql(typeDefs), DIRECTIVES],
    context: async (expressContext) => {
      const token: string | undefined =
        expressContext.req.headers.authorization ?? customContext?.token;

      const user = await authMiddleware(token);
      return {
        req: expressContext.req,
        res: expressContext.res,
        user,
      } as Context;
    },
  });

  return server;
};
