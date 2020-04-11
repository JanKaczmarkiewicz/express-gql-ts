import { GraphQLServer } from "graphql-yoga";
import importModulesSchemas from "./utils/importModulesSchemas";
import * as morgan from "morgan";

export default () => {
  const server = new GraphQLServer({
    schema: importModulesSchemas(),
  });

  server.express.use(morgan("tiny"));

  server.start(() => {
    console.log(`Server is running on localhost:${process.env.PORT}`);
  });
  return server;
};
