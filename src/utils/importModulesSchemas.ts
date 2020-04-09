import * as fs from "fs";
import * as path from "path";
import { makeExecutableSchema, mergeSchemas } from "graphql-tools";
import { importSchema } from "graphql-import";

const pathToModules = path.join(__dirname, "../modules");

export default () =>
  mergeSchemas({
    schemas: fs
      .readdirSync(pathToModules)
      .filter((folder) => !folder.startsWith("_"))
      .map((folder) =>
        makeExecutableSchema({
          resolvers: require(`${pathToModules}/${folder}/resolvers`).resolvers,
          typeDefs: importSchema(`${pathToModules}/${folder}/schema.graphql`),
        })
      ),
  });
