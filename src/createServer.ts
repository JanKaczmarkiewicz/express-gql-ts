import { GraphQLServer } from "graphql-yoga";

import importModulesSchemas from "./utils/importModulesSchemas";

export default () => {
  const server = new GraphQLServer({
    schema: importModulesSchemas(),
    context: (req) => ({ ...req }),
  });

  server.start(() => {
    console.log(`Server is running on localhost:${process.env.PORT}`);
  });
  return server;
};
