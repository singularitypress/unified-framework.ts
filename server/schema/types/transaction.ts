import { GraphQLFloat, GraphQLObjectType, GraphQLString } from "graphql";

export const TransactionType: GraphQLObjectType<any, any> = new GraphQLObjectType({
  name: "Transaction",
  fields: {
    date: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    amount: {
      type: GraphQLFloat,
    },
    account: {
      type: GraphQLString,
    },
  },
});
