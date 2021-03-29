import { GraphQLSchema } from "graphql";
import { mutation } from "./mutations";
import { RootQuery } from "./queries";

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
