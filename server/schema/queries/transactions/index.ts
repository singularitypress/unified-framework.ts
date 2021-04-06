import {
  GraphQLFieldConfigMap,
  GraphQLList,
  GraphQLString,
  Thunk,
} from "graphql";
import { ITransaction } from "../../../@types";
import { TransactionType } from "../../types";
import { parse } from "../../../services";

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
      include: {
        type: GraphQLList(GraphQLString),
      },
      exclude: {
        type: GraphQLList(GraphQLString),
      },
      account: {
        type: GraphQLString,
      },
      institution: {
        type: GraphQLString,
      },
    },
    resolve (
      parentValue,
      { startDate, endDate, account, institution, include, exclude },
    ) {
      let filteredData = [...parse(`${process.env.ROOT}`)] as ITransaction[];

      if (startDate) {
        filteredData = filteredData.filter(
          (transaction) => new Date(transaction.date) >= new Date(startDate),
        );
      }

      if (endDate) {
        filteredData = filteredData.filter(
          (transaction) => new Date(transaction.date) <= new Date(endDate),
        );
      }

      if (include) {
        include.forEach((inclusionTerm: string) => {
          filteredData = filteredData.filter(
            (transaction) =>
              transaction.description
                .toLowerCase()
                .indexOf(inclusionTerm.toLowerCase()) > -1,
          );
        });
      }

      if (exclude) {
        exclude.forEach((exclusionTerm: string) => {
          filteredData = filteredData.filter(
            (transaction) =>
              transaction.description
                .toLowerCase()
                .indexOf(exclusionTerm.toLowerCase()) < 0,
          );
        });
      }

      if (account) {
        filteredData = filteredData.filter(
          (transaction) =>
            transaction.account?.toLowerCase().indexOf(account.toLowerCase()) >
            -1,
        );
      }

      if (institution) {
        filteredData = filteredData.filter(
          (transaction) =>
            transaction.institution.toLowerCase() === institution.toLowerCase(),
        );
      }
      return filteredData;
    },
  },
};
