import { readdirSync, readFileSync } from "fs";
import { ITransaction } from "../@types";

export const bnsParser = (rootDir: string) => {
  const accounts = readdirSync(rootDir).map((accountName) => {
    return {
      account: accountName,
      files: readdirSync(`${rootDir}\\${accountName}`).map(
        (fileName) => `${rootDir}\\${accountName}\\${fileName}`,
      ),
    };
  });

  const transactions = accounts.reduce((totalTransactions, currentAccount) => {
    currentAccount.files.forEach((file) => {
      const rows = readFileSync(file, "utf-8").split("\n");
      rows.forEach((row) => {
        const cells = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        const date = cells[0];
        let amount: number;
        let description: string;
        const { account } = currentAccount;
        if (currentAccount.account === "debit") {
          amount = parseFloat(cells[1]);
          description = `${cells[3]} ${cells[4]}`.replace(/"/g, "");
        } else {
          amount = parseFloat(cells[2]);
          description = cells[1]?.replace(/"/g, "");
        }
        totalTransactions.push({
          date,
          amount,
          description,
          account,
        });
      });
      return totalTransactions;
    });
    return totalTransactions;
  }, [] as ITransaction[]) as ITransaction[];

  return transactions.sort((a, b) => {
    return (new Date(a.date).getTime()) - (new Date(b.date).getTime());
  });
};
