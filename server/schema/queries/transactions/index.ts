import {
  GraphQLFieldConfigMap,
  GraphQLList,
  GraphQLString,
  Thunk,
} from "graphql";
import { ITransaction } from "../../../@types";
import { TransactionType } from "../../types";
import { bnsParser } from "../../../services";

export const transactionsQueries: Thunk<GraphQLFieldConfigMap<any, any>> = {
  transactions: {
    type: GraphQLList(TransactionType),
    args: {
      startDate: {
        type: GraphQLString,
      },
      endDate: {
        type: GraphQLString,
      },
      keyword: {
        type: GraphQLString,
      },
      account: {
        type: GraphQLString,
      },
    },
    resolve (parentValue, { startDate, endDate, keyword, account }) {
      let filteredData = [...bnsParser(`${process.env.BNS}`)] as ITransaction[];

      if (startDate) {
        filteredData = filteredData.filter((transaction) => new Date(transaction.date) >= new Date(startDate));
      }

      if (endDate) {
        filteredData = filteredData.filter((transaction) => new Date(transaction.date) <= new Date(endDate));
      }

      if (keyword) {
        filteredData = filteredData.filter(
          (transaction) =>
            transaction.description
              ?.toLowerCase()
              .indexOf(keyword.toLowerCase()) > -1,
        );
      }
      if (account) {
        filteredData = filteredData.filter(
          (transaction) =>
            transaction.account?.toLowerCase().indexOf(account.toLowerCase()) >
            -1,
        );
      }
      return filteredData;
    },
  },
};
