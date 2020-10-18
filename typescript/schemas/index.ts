import Axios from "axios";
import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLList
} from "graphql";

import { CompanyType } from "./company";
import { UserType } from "./user";

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: {
        id: {
          type: GraphQLString,
        },
      },
      resolve (parentValue, args) {
        return Axios.get(`http://localhost:3000/users/${args.id}`).then(
          (res) => res.data,
        );
      },
    },
    company: {
      type: CompanyType,
      args: {
        id: {
          type: GraphQLString,
        },
      },
      resolve (parentValue, args) {
        return Axios.get(`http://localhost:3000/companies/${args.id}`).then(res => res.data);
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
});
