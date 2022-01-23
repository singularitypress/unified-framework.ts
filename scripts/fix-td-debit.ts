import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const file = process.argv.pop();

const data = fs.readFileSync(
  `${process.env.ROOT}/${file}.csv`,
  "utf-8",
);

fs.writeFileSync(
  `${process.env.ROOT}/${file}.csv`,
  data
    .split("\n")
    .filter(item => item)
    .map((row) => {
      const [date, description, withdrawal, deposit] = row.split(",");
      return `${date},${description},${withdrawal ? `-${withdrawal.replace("\r","")}` : deposit.replace("\r","")}`;
    }).join("\n"),
  "utf-8"
);