import * as fs from "fs";
import * as path from "path";
import { IResolvers } from "graphql-tools";
import { AuthenticatedDirective } from "../directives/authenticated";
import gql from "graphql-tag";
import { DIRECTIVES } from "@graphql-codegen/typescript-mongodb";
import { ValidateDirective } from "../directives/validate";

const pathToModules = path.join(__dirname, "../modules");

export default () => {
  const folders = fs
    .readdirSync(pathToModules)
    .filter((folder) => !folder.startsWith("_"));

  //resolvers
  const resolvers: IResolvers = { Mutation: {}, Query: {} };
  folders.forEach((folder) => {
    const resolversPath = `${pathToModules}\\${folder}\\resolvers.ts`;
    if (!fs.existsSync(resolversPath)) return;

    const { Query, Mutation } = require(resolversPath).resolvers;
    Object.assign(resolvers.Mutation, Mutation);
    Object.assign(resolvers.Query, Query);
  });

  //typeDefs
  const moduleTypeDefs = folders
    .map((folder) =>
      fs.readFileSync(`${pathToModules}\\${folder}\\schema.graphql`, "utf8")
    )
    .join(" ");

  const typeDefsStr = `
  type Query {
    _empty: String
  } 
  type Mutation {
    _empty: String
  }
  ${moduleTypeDefs}`;

  const typeDefs = [gql(typeDefsStr), DIRECTIVES];

  //directives
  const directives = {
    authenticated: AuthenticatedDirective,
    validate: ValidateDirective,
  };

  return { typeDefs, resolvers, directives };
};
