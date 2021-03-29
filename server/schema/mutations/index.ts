import Axios from "axios";
import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UserType } from "../types";

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
        }).then((res) => res.data);
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve (parentValue, args) {
        Axios.delete(`http://localhost:3000/users/${args.id}`).then((res) => res.data);
      },
    },
    editUser: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
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
      resolve (parentValue, args) {
        return Axios.patch(`http://localhost:3000/users/${args.id}`, args).then((res) => res.data);
      },
    },
  },
});
