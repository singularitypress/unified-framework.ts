import Axios from "axios";
import { GraphQLObjectType, GraphQLString } from "graphql";
import { ICompany, IUser } from "../../@types";

import { CompanyType } from "./company";
import { UserType } from "./user";

export const RootQuery = new GraphQLObjectType({
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
        return Axios.get("http://localhost:3000/users").then((res) =>
          res.data.find((d: IUser) => d.id === args.id),
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
        return Axios.get("http://localhost:3000/companies").then((res) =>
          res.data.find((d: ICompany) => d.id === args.id),
        );
      },
    },
  },
});
