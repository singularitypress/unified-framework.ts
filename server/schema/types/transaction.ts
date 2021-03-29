import { GraphQLObjectType, GraphQLString } from "graphql";

export const TransactionType: GraphQLObjectType<any, any> = new GraphQLObjectType({
  name: "Transaction",
  fields: {
    date: {
      type: GraphQLString,
    },
    tx: {
      type: GraphQLString,
    },
    amt: {
      type: GraphQLString,
    },
  },
});
