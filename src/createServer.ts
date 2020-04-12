import { GraphQLServer } from "graphql-yoga";

// import * as morgan from "morgan";

import importModulesSchemas from "./utils/importModulesSchemas";

export default () => {
  const server = new GraphQLServer({
    schema: importModulesSchemas(),
    context: (req) => ({ ...req }),
  });

  // server.express.use(morgan("tiny"));

  server.start(() => {
    console.log(`Server is running on localhost:${process.env.PORT}`);
  });
  return server;
};
