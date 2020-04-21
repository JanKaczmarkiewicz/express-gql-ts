import { defaultFieldResolver, GraphQLField } from "graphql";
import { Context } from "../types/util";
import { AuthenticationError, SchemaDirectiveVisitor } from "apollo-server";
import { responceError } from "../errors/responce";

export class IsAuthenticatedDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, Context>) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async (...resolverArgs) => {
      const [, , { user }] = resolverArgs;
      if (user && user.confirmed) {
        const result = await resolve.apply(this, resolverArgs);
        return result;
      }

      throw new AuthenticationError(responceError.authenticationFailed);
    };
  }
}
