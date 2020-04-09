import { GraphQLServer } from "graphql-yoga";
import connectToDatabase from "./db/connect";
import * as dotenv from "dotenv";
import importModulesSchemas from "./utils/importModulesSchemas";

dotenv.config();

const server = new GraphQLServer({ schema: importModulesSchemas() });

connectToDatabase().then(() => {
  server.start(() =>
    console.log(`Server is running on localhost:${process.env.PORT}`)
  );
});
