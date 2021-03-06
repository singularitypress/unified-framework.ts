import Axios from "axios";
import { GraphQLObjectType, GraphQLString, GraphQLInt } from "graphql";
import { ICompany } from "../../@types";
import { CompanyType } from "./company";

export const UserType: GraphQLObjectType<any, any> = new GraphQLObjectType({
  name: "User",
  fields: () => ({
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
        return Axios.get("http://localhost:3000/companies").then((res) =>
          res.data.find((d: ICompany) => d.id === parentValue.companyId),
        );
      },
    },
  }),
});
