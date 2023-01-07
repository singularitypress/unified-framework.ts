export type TArgsKeys = "root" | "schema" | "institution" | "account" | "out";
export type TInstitution = "bns" | "td" | "rbc" | "pc";
export type TAccount = "amex" | "visa" | "mastercard" | "chequing" | "tfsa" | "rrsp";
export interface ITransaction {
  institution: TInstitution;
  account: TAccount;
  date: number;
  payee: string;
  amount: number;
}
export interface ITransactionArgs {
  institution?: TInstitution;
  account?: TAccount;
  payee?: string;
  start?: number;
  end?: number;
}

export * from "./elections";
export * from "./parties";