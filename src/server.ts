import { GraphQLServer } from "graphql-yoga";
import createDatabaseConnection from "./db/connect";
import * as dotenv from "dotenv";
import importModulesSchemas from "./utils/importModulesSchemas";

dotenv.config();

const server = new GraphQLServer({ schema: importModulesSchemas() });

createDatabaseConnection().then(() => {
  server.start(() =>
    console.log(`Server is running on localhost:${process.env.PORT}`)
  );
});
