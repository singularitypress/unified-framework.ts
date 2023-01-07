import { makeExecutableSchema } from "@graphql-tools/schema";
import { ICandidate, IElectionResult, ITransaction, ITransactionArgs } from "@types";
import { electionsResolver } from "./elections-resolver";

const TransactionResolver = (data: ITransaction[]) => ({
  Query: {
    transactions: (
      parent: undefined,
      { institution, account, payee, start, end }: ITransactionArgs,
    ) => {
      let filteredData = data;

      if (institution) {
        filteredData = filteredData.filter(
          (item) => item.institution === institution,
        );
      }

      if (account) {
        filteredData = filteredData.filter((item) => item.account === account);
      }

      if (payee) {
        filteredData = filteredData.filter((item) =>
          item.payee.includes(payee),
        );
      }

      if (start) {
        filteredData = filteredData.filter((item) => item.date >= start);
      }

      if (end) {
        filteredData = filteredData.filter((item) => item.date <= end);
      }

      return filteredData;
    },
  },
});

export const schema = (transactionData: ITransaction[], HFER_e: ICandidate[] = [], elections: IElectionResult[] = []) =>
  makeExecutableSchema({
    resolvers: [TransactionResolver(transactionData), electionsResolver(HFER_e, elections)],
    typeDefs: [TransactionTypes, ElectionTypes],
  });
