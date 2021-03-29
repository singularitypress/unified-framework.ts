import path from "path";
import fs from "fs";
import { GraphQLFieldConfigMap, GraphQLList, GraphQLString, Thunk } from "graphql";
import { ITransaction } from "../../../@types";
import { TransactionType } from "../../types";

export const transactionsQueries: Thunk<GraphQLFieldConfigMap<any, any>> = {
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
};
