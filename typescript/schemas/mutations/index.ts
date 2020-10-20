import Axios from "axios";
import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UserType } from "../queries/user";

export const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: {
          type: new GraphQLNonNull(GraphQLString),
        },
        age: {
          type: new GraphQLNonNull(GraphQLInt),
        },
        companyId: {
          type: GraphQLString,
        },
      },
      resolve (parentValue, args) {
        const { firstName, age } = args;
        return Axios.post("http://localhost:3000/users", {
          firstName,
          age,
        }).then(res => res.data);
      },
    },
  },
});
