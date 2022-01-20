import { GraphQLFloat, GraphQLObjectType, GraphQLString } from "graphql";

export const GameType: GraphQLObjectType<any, any> = new GraphQLObjectType({
  name: "Game",
  fields: {
    name: {
      type: GraphQLString,
    },
    platform: {
      type: GraphQLString,
    },
    completed: {
      type: GraphQLString,
    },
    bought: {
      type: GraphQLString,
    },
    price: {
      type: GraphQLFloat,
    },
    minImage: {
      type: GraphQLString,
    },
    maxImage: {
      type: GraphQLString,
    }
  },
});
