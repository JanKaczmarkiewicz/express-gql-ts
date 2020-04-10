import * as fs from "fs";
import * as path from "path";
import { makeExecutableSchema, mergeSchemas } from "graphql-tools";
import { DIRECTIVES } from "@graphql-codegen/typescript-mongodb";

const pathToModules = path.join(__dirname, "../modules");

export default () => {
  const modulesSchemas = fs
    .readdirSync(pathToModules)
    .filter((folder) => !folder.startsWith("_"))
    .reduce(
      (schema: any, folder) => {
        const resolversPath = `${pathToModules}\\${folder}\\resolvers.ts`;
        const resolver = fs.existsSync(resolversPath)
          ? require(resolversPath).resolvers
          : null;

        const typeDef = fs.readFileSync(
          `${pathToModules}\\${folder}\\schema.graphql`,
          "utf8"
        );
        return {
          resolvers: [...schema.resolvers, resolver],
          typeDefs: [...schema.typeDefs, typeDef],
        };
      },
      { resolvers: [], typeDefs: [] }
    );

  modulesSchemas.typeDefs.push(DIRECTIVES);
  return mergeSchemas({ schemas: [makeExecutableSchema(modulesSchemas)] });
};
