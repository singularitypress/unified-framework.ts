# Unified Framework

## JSON db CLI
There's a node script in here designed to create JSON copies of your bank CSV statements. It lets you determined what the object properties are called for transactions, but generally the ones that matter the most that you *should* adhere to are: `date`, `amount`, and `payee` with the order depending on your CSV statement.

If you had a folder of Royal Bank CSV statements for a debit card, i.e. `%userprofile%\Documents\bank-statements\rbc\debit` your args would look like: `--root=C:/Users/JohnSmith/Documents/bank-statements/rbc/debit --schema="date,amount,skip,payee,payee" --out="rbc-debit.json"`