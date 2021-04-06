export const CSV_SCHEMA = {
  bns: {
    debit: {
      date: 0,
      amount: 1,
      description: [3, 4],
    },
    visa: {
      date: 0,
      amount: 2,
      description: [1],
    },
    amex: {
      date: 0,
      amount: 2,
      description: [1],
    },
  },
  pc: {
    mastercard: {
      date: 3,
      amount: 5,
      description: [0],
    },
  },
};
