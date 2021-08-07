import {
  GraphQLBoolean,
  GraphQLFieldConfigMap,
  GraphQLList,
  GraphQLString,
  Thunk,
} from "graphql";
import { ITransaction, ITransactionQueryParams } from "../../../@types";
import { TransactionType } from "../../types";
import { parse, monthlyTransactions } from "../../../services";

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
      monthly: {
        type: GraphQLBoolean,
      },
    },
    resolve (
      parentValue,
      args,
    ) {
      const { startDate, endDate, account, institution, include, exclude, monthly }: ITransactionQueryParams = args as any;
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
        let tmpTx = [] as ITransaction[];
        include.forEach((inclusionTerm: string) => {
          tmpTx = [...tmpTx, ...filteredData.filter(
            (transaction) =>
              transaction.description
                .toLowerCase()
                .indexOf(inclusionTerm.toLowerCase()) > -1,
          )];
        });
        filteredData = tmpTx;
      }

      if (exclude) {
        let tmpTx = [] as ITransaction[];
        exclude.forEach((exclusionTerm: string) => {
          tmpTx = [...tmpTx, ...filteredData.filter(
            (transaction) =>
              transaction.description
                .toLowerCase()
                .indexOf(exclusionTerm.toLowerCase()) < 0,
          )];
        });
        filteredData = tmpTx;
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

      if (monthly) {
        filteredData = monthlyTransactions(filteredData);
      }

      return filteredData;
    },
  },
};
