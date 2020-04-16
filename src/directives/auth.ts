import { defaultFieldResolver, GraphQLField } from "graphql";
import { SchemaDirectiveVisitor } from "graphql-tools";

export class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, any>) {
    const { resolve = defaultFieldResolver } = field;
    const { roles: expectedRoles = [] } = this.args;
    field.resolve = (...args) => {
      const [, , context] = args;

      if (
        expectedRoles.length === 0 ||
        expectedRoles.some((r: any) => context.roles.includes(r))
      ) {
        // Call original resolver if role check has passed
        return resolve.apply(this, args);
      }

      // We has two options here. throw an error or return null (if field is nullable).
      throw new Error(
        `You are not authorized. Expected roles: ${expectedRoles.join(", ")}`
      );
    };
  }
}
