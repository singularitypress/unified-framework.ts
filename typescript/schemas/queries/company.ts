import Axios from "axios";
import { GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { IUser } from "../../@types";
import { UserType } from "./user";

export const CompanyType: GraphQLObjectType<any, any> = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    users: {
      type: GraphQLList(UserType),
      resolve (parentValue, args) {
        return Axios.get("http://localhost:3000/users").then((res) =>
          res.data.filter(
            (user: IUser) => user.companyId === parentValue.id,
          ),
        );
      },
    },
  }),
});
