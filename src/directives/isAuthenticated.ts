import { defaultFieldResolver, GraphQLField } from "graphql";
import { Context } from "../types/util";
import { AuthenticationError, SchemaDirectiveVisitor } from "apollo-server";

export class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, Context>) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async (...resolverArgs) => {
      const [, , { user }] = resolverArgs;
      if (user && user.confirmed) {
        const result = await resolve.apply(this, resolverArgs);
        return result;
      }

      throw new AuthenticationError(
        "You must be the authenticated user to get this information"
      );
    };
  }
}
