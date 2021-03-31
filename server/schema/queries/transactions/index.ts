import { GraphQLFieldConfigMap, GraphQLList, GraphQLString, Thunk } from "graphql";
import { ITransaction } from "../../../@types";
import { TransactionType } from "../../types";
import { bnsParser } from "../../../services";

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
      account: {
        type: GraphQLString,
      },
    },
    resolve (parentValue, { month, keyword, account }) {
      let filteredData = [...bnsParser(`${process.env.BNS}`)] as ITransaction[];
      if (month) filteredData = filteredData.filter((transaction) => transaction.date.indexOf(month) > -1);
      if (keyword) filteredData = filteredData.filter((transaction) => transaction.description?.toLowerCase().indexOf(keyword.toLowerCase()) > -1);
      if (account) filteredData = filteredData.filter((transaction) => transaction.account?.toLowerCase().indexOf(account.toLowerCase()) > -1);
      return filteredData;
    },
  },
};
