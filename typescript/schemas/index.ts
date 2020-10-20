import { GraphQLSchema } from "graphql";
import { RootQuery } from "./queries";

export const schema = new GraphQLSchema({
  query: RootQuery,
});
