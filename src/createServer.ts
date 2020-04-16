import { ApolloServer, gql } from "apollo-server";

import importModulesSchemas from "./utils/importModulesSchemas";
import { DIRECTIVES } from "@graphql-codegen/typescript-mongodb";

export default () => {
  const { resolvers, typeDefs } = importModulesSchemas();

  const server = new ApolloServer({
    resolvers,
    typeDefs: [gql(typeDefs), DIRECTIVES],
    context: (req) => ({ ...req }),
  });

  server.listen({ port: process.env.PORT }).then(({ port }) => {
    console.log(`Server is running on localhost:${port}`);
  });
  return server;
};
