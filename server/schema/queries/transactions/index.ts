import {
  GraphQLBoolean,
  GraphQLFieldConfig,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLString,
  ThunkObjMap,
} from "graphql";
import { ITransaction, ITransactionQueryParams } from "../../../@types";
import { TransactionType } from "../../types";
import { parse, monthlyTransactions, keywordRegexp } from "../../../services";

export const transactionsQueries: ThunkObjMap<GraphQLFieldConfig<any, any>> = {
  transactions: {
    type: new GraphQLList(TransactionType),
    args: {
      startDate: {
        type: GraphQLString,
      },
      endDate: {
        type: GraphQLString,
      },
      include: {
        type: new GraphQLList(GraphQLString),
      },
      exclude: {
        type: new GraphQLList(GraphQLString),
      },
      account: {
        type: new GraphQLList(GraphQLString),
      },
      institution: {
        type: GraphQLString,
      },
      monthly: {
        type: GraphQLBoolean,
      },
      min: {
        type: GraphQLInt,
      },
      max: {
        type: GraphQLFloat,
      },
    },
    resolve (
      parentValue,
      args,
    ) {
      const {
        startDate = parentValue?.startDate,
        endDate = parentValue?.endDate,
        account = parentValue?.account,
        institution = parentValue?.institution,
        include = parentValue?.include,
        exclude = parentValue?.exclude,
        monthly = parentValue?.monthly,
        min = parentValue?.min,
        max = parentValue?.max,
      }: ITransactionQueryParams = args;
      let filteredData = [...parse(`${process.env.ROOT}`)] as ITransaction[];

      if (typeof min === "number") {
        filteredData = filteredData.filter(
          (transaction) => transaction.amount >= min,
        );
      }

      if (typeof max === "number") {
        filteredData = filteredData.filter(
          (transaction) => transaction.amount <= max,
        );
      }

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
        const inclusionRegExp = keywordRegexp(include);
        filteredData = filteredData.reduce((currArr, currTx) => {
          if (currTx.description.toLowerCase().match(inclusionRegExp)) return [...currArr, currTx];
          else return [...currArr];
        }, [] as ITransaction[]);
      }

      if (exclude) {
        const exclusionRegExp = keywordRegexp(exclude);
        filteredData = filteredData.reduce((currArr, currTx) => {
          if (!currTx.description.toLowerCase().match(exclusionRegExp)) return [...currArr, currTx];
          else return [...currArr];
        }, [] as ITransaction[]);
      }

      if (account) {
        const accountsRegExp = keywordRegexp(account);
        filteredData = filteredData.reduce((currArr, currTx) => {
          if (currTx.account.toLowerCase().match(accountsRegExp)) return [...currArr, currTx];
          else return [...currArr];
        }, [] as ITransaction[]);
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
