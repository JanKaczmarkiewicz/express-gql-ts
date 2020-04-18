import * as fs from "fs";
import * as path from "path";
import { IResolvers } from "graphql-tools";

const pathToModules = path.join(__dirname, "../modules");

export default () => {
  const folders = fs
    .readdirSync(pathToModules)
    .filter((folder) => !folder.startsWith("_"));

  const resolvers: IResolvers = { Mutation: {}, Query: {} };

  folders.forEach((folder) => {
    const resolversPath = `${pathToModules}\\${folder}\\resolvers.ts`;
    if (!fs.existsSync(resolversPath)) return;

    const { Query, Mutation } = require(resolversPath).resolvers;
    Object.assign(resolvers.Mutation, Mutation);
    Object.assign(resolvers.Query, Query);
  });

  const moduleTypeDefs = folders
    .map((folder) =>
      fs.readFileSync(`${pathToModules}\\${folder}\\schema.graphql`, "utf8")
    )
    .join(" ");

  const typeDefs = `
  type Query {
    _empty: String
  } 
  type Mutation {
    _empty: String
  }
  ${moduleTypeDefs}`;

  console.log(typeDefs);

  return { typeDefs, resolvers };
};
