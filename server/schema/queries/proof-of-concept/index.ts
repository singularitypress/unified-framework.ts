import axios from "axios";
import { GraphQLFieldConfigMap, GraphQLString, Thunk } from "graphql";
import { ICompany, IUser } from "../../../@types";
import { CompanyType, UserType } from "../../types";

export const proofOfConceptQueries: Thunk<GraphQLFieldConfigMap<any, any>> = {
  user: {
    type: UserType,
    args: {
      id: {
        type: GraphQLString,
      },
    },
    resolve (parentValue, args) {
      return axios.get("http://localhost:3000/users").then((res) =>
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
      return axios.get("http://localhost:3000/companies").then((res) =>
        res.data.find((d: ICompany) => d.id === args.id),
      );
    },
  },
};