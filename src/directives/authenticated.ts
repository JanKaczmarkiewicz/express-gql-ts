import { AuthenticationError, SchemaDirectiveVisitor } from "apollo-server";
import { defaultFieldResolver, GraphQLField } from "graphql";

import { Context } from "../types/util";
import { responceError } from "../errors/responce";
import { Role } from "../types/types";

export class AuthenticatedDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, Context>) {
    const { resolve = defaultFieldResolver } = field;

    const { roles } = this.args as { roles: Role[] };
    field.resolve = async (...resolverArgs) => {
      const [, , { user }] = resolverArgs;

      if (!user || !user.confirmed)
        throw new AuthenticationError(responceError.authenticationFailed);

      if (roles.length > 0 && !roles.find((role) => role === user.role))
        throw new AuthenticationError(responceError.noRequiredRole);

      const result = await resolve.apply(this, resolverArgs);
      return result;
    };
  }
}
