import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { UserType } from "../queries/user";

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: {
          type: GraphQLString,
        },
        age: {
          type: GraphQLInt,
        },
        companyId: {
          type: GraphQLString,
        },
      },
      resolve () {

      },
    },
  },
});
