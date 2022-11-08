# Unified Framework

## JSON db CLI

There's a node script in here designed to create JSON copies of your bank CSV statements. It lets you determine what the object properties are called for transactions, but generally the ones that matter the most that you need adhere to are:
| property | definition |
| --- | --- |
| `date` | transaction date that gets transformed into an epoch ms value |
| `amount` | transaction amount value, gets sanitized |
| `payee` | actual payment description |
| `skip` | skip this column |

If you want to merge the values of multiple columns, you can just reuse a property.

If you had a folder of Royal Bank CSV statements for a debit card, i.e. `%userprofile%\Documents\bank-statements\rbc\debit`, add it to your .env as whatever you want like IDK_RBC_DEBIT, and your args would look like:

```bash
npm run build:db -- --root=IDK_RBC_DEBIT --schema="date,amount,skip,payee,payee" --institution="rbc" --account="chequing" --out="rbc-debit.json"
```
