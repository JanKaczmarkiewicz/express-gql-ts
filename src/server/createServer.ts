import { ApolloServer, gql } from "apollo-server";

import importModulesSchemas from "../utils/importModulesSchemas";
import { DIRECTIVES } from "@graphql-codegen/typescript-mongodb";

export default (customContext: object = {}) => {
  const { resolvers, typeDefs } = importModulesSchemas();

  const server = new ApolloServer({
    resolvers,
    typeDefs: [gql(typeDefs), DIRECTIVES],
    context: (expressContext) => ({ ...expressContext, ...customContext }),
  });

  return server;
};
