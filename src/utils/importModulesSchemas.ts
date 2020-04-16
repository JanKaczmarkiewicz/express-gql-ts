import * as fs from "fs";
import * as path from "path";
import { IResolvers } from "graphql-tools";

const pathToModules = path.join(__dirname, "../modules");

export default () => {
  const folders = fs
    .readdirSync(pathToModules)
    .filter((folder) => !folder.startsWith("_"));

  const resolvers: IResolvers[] = [];

  folders.forEach((folder) => {
    const resolversPath = `${pathToModules}\\${folder}\\resolvers.ts`;
    fs.existsSync(resolversPath) &&
      resolvers.push(require(resolversPath).resolvers);
  });

  const typeDefs = folders
    .map((folder) =>
      fs.readFileSync(`${pathToModules}\\${folder}\\schema.graphql`, "utf8")
    )
    .join();

  return { typeDefs, resolvers };
};
