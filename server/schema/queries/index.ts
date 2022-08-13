import { GraphQLObjectType } from "graphql";
import { proofOfConceptQueries } from "./proof-of-concept";
import { transactionsQueries } from "./transactions";

export const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    ...proofOfConceptQueries,
    ...transactionsQueries,
  },
});
