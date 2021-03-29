import Axios from "axios";
import { GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import path from "path";
import fs from "fs";

import { ICompany, ITransaction, IUser } from "../../@types";
import { CompanyType, TransactionType, UserType } from "../types";

require("dotenv").config();

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
    transactions: {
      type: GraphQLList(TransactionType),
      args: {
        month: {
          type: GraphQLString,
        },
        keyword: {
          type: GraphQLString,
        },
      },
      resolve (parentValue, { month, keyword }) {
        let filteredData = [] as ITransaction[];
        const data = fs.readFileSync(path.resolve(`${process.env.XLSX}`), "utf-8");
        const strArr = data.split("\n").map((str) => str.split(","));
        const parsed = strArr.reduce((previousValue: any, currentValue) => {
          previousValue.push({
            date: currentValue[0],
            tx: currentValue[1],
            amt: currentValue[2]?.replace("\r", ""),
          });
          return previousValue;
        }, []) as ITransaction[];
        parsed.pop();
        filteredData = parsed;
        if (month) filteredData = parsed.filter((transaction) => transaction.date.indexOf(month) > -1);
        if (keyword) filteredData = parsed.filter((transaction) => transaction.tx.toLowerCase().indexOf(keyword.toLowerCase()) > -1);

        return filteredData;
      },
    },
  },
});
