export interface ITransaction {
  amount: number;
  account: string;
  description: string;
  date: string;
  institution: string;
};

export interface ITransactionQueryParams {
  startDate: string;
  endDate: string;
  account: string[];
  institution: string;
  include: string[];
  exclude: string[];
  monthly: boolean;
}
