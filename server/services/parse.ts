import { readdirSync, readFileSync } from "fs";
import { ITransaction } from "../@types";
import { CSV_SCHEMA } from "./csvSchema";

export const parse = (rootDir: string) => {
  const accounts = [] as {
    institution: string;
    account: string;
    files: string[]
  }[];

  readdirSync(rootDir).forEach((institution) => {
    const institutionPath = `${rootDir}\\${institution}`;

    readdirSync(institutionPath).forEach((account) => {
      const accountPath = `${institutionPath}\\${account}`;

      accounts.push({
        institution,
        account,
        files: readdirSync(accountPath).map((fileName) => `${accountPath}\\${fileName}`),
      });
    });
  });

  const transactions = accounts.reduce((totalTransactions, currentAccount) => {
    currentAccount.files.forEach((file) => {
      const rows = readFileSync(file, "utf-8").split("\n").filter((row) => !(row.indexOf("Description") > -1 || row === ""));
      rows.forEach((row) => {
        const cells = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        const { account, institution } = currentAccount;
        const date = cells[(CSV_SCHEMA as any)[institution][account].date].replace(/"/g, "");
        const amount = parseFloat(cells[(CSV_SCHEMA as any)[institution][account].amount].replace(/"/g, ""));
        const description = (CSV_SCHEMA as any)[institution][account].description.reduce((str: string, index: number) => {
          return str + `${cells[index]}`;
        }, "").replace(/"/g, "").replace(/\s+/g, " ").replace(/\s$/, "");
        totalTransactions.push({
          date,
          amount,
          description,
          account,
          institution,
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
