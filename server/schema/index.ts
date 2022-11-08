import { makeExecutableSchema } from "@graphql-tools/schema";
import { ITransaction, ITransactionArgs } from "@types";

const typeDefinitions = /* GraphQL */ `
  enum Account {
    amex
    visa
    mastercard
    chequing
    tfsa
    rrsp
  }

  enum Institution {
    bns
    td
    rbc
    pc
  }

  type Transaction {
    institution: Institution
    account: Account
    date: Float
    payee: String
    amount: Float
  }

  type Query {
    transactions(
      institution: Institution
      account: Account
      payee: String
      start: Float
      end: Float
    ): [Transaction]
  }
`;

const resolvers = (data: ITransaction[]) => ({
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

export const schema = (data: ITransaction[]) =>
  makeExecutableSchema({
    resolvers: [resolvers(data)],
    typeDefs: [typeDefinitions],
  });
