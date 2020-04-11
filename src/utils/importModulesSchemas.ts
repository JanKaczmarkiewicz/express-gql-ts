import * as fs from "fs";
import * as path from "path";
import { makeExecutableSchema } from "graphql-tools";
import { DIRECTIVES } from "@graphql-codegen/typescript-mongodb";

const pathToModules = path.join(__dirname, "../modules");

export default () => {
  const folders = fs
    .readdirSync(pathToModules)
    .filter((folder) => !folder.startsWith("_"));

  const resolvers = folders.map((folder) => {
    const resolversPath = `${pathToModules}\\${folder}\\resolvers.ts`;
    return fs.existsSync(resolversPath)
      ? require(resolversPath).resolvers
      : null;
  });

  const typeDefs = folders.map((folder) =>
    fs.readFileSync(`${pathToModules}\\${folder}\\schema.graphql`, "utf8")
  );

  const schemas = makeExecutableSchema({
    typeDefs: [DIRECTIVES, ...typeDefs],
    resolvers,
  });

  return schemas;
};
