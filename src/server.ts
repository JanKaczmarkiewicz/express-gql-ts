import { GraphQLServer } from "graphql-yoga";
import connectToDatabase from "./db/connect";
import * as dotenv from "dotenv";

dotenv.config();

const typeDefs = `
  type Query {
    hello(name: String): String!
  }
`;

const resolvers = {
  Query: {
    hello: (_: any, { name }: { name: string }) => `Hello ${name || "World"}`,
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });

connectToDatabase().then(() => {
  server.start(() => console.log("Server is running on localhost:4000"));
});
