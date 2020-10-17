import Axios from "axios";
import {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from "graphql";

const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: {
    id: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
  },
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: {
      type: GraphQLString,
    },
    firstName: {
      type: GraphQLString,
    },
    age: {
      type: GraphQLInt,
    },
    company: {
      type: CompanyType,
      resolve (parentValue, args) {
        return Axios.get(`http://localhost:3000/companies/${parentValue.companyId}`).then(res => res.data);
      },
    },
  },
});

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
