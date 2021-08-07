import { ITransaction } from "../@types";

/**
 *
 * @param filteredData - the current array of transactions we need to search.
 * @returns We use reduce on the list of transactions so we can make and return a new array
 * wherein each item has to be in the total list at least three times by checking to see if
 * the description and amount appear in multiple transactions.
 */
export const monthlyTransactions = (filteredData: ITransaction[]) => {
  return filteredData.reduce((monthlyTx, currentTx) => {
    const duplicates =
      filteredData.filter(
        (tx) =>
          tx.description === currentTx.description &&
          tx.amount === currentTx.amount,
      ).length >= 3;

    const hasCurrentTx = !!monthlyTx.find(
      (tx) => currentTx.description === tx.description,
    );

    if (duplicates && !hasCurrentTx) {
      monthlyTx.push(currentTx);
    }

    return monthlyTx;
  }, [] as ITransaction[]);
};
