import { readdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { TArgsKeys } from "../@types";
import dotenv from "dotenv";

dotenv.config();

const sanitizeCommaRegxp = /"[^"]+,[^"]+"/g;
const sanitizeExtraCharRegxp = /((\s\s)+|(^"|"$|""))|(^"|"$|"")/g;

const args = process.argv.slice(2).reduce((obj, arg) => {
  const [key, value] = arg.replace("--", "").split("=");
  return { ...obj, [key]: value };
}, {} as { [key in TArgsKeys]: string });

const tx: { [key: string]: string | number }[] = [];
let csvLines = 0;

const format = (type: string, cell: string) => {
  switch (type) {
    case "date":
      return new Date(cell).getTime();
    case "amount":
      return Number(cell.replace(/("|\$|\,)/g, ""));
    default:
      return (cell ?? "").replace(sanitizeExtraCharRegxp, "");
  }
};

if (
  "root" in args &&
  "schema" in args &&
  "institution" in args &&
  "account" in args &&
  "out" in args
) {
  const dir = process.env[args.root] ?? "";
  readdirSync(resolve(dir)).forEach((fileName) => {
    const file = readFileSync(`${dir}/${fileName}`, {
      encoding: "utf-8",
    });
    const lines = file.split("\n");
    csvLines += lines.length;
    const schema = args.schema.split(",");

    lines
      .filter((line) => !!line)
      .forEach((line) => {
        const hasStrayComma = line.match(sanitizeCommaRegxp);
        let sanitizedLine = line;
        if (hasStrayComma) {
          sanitizedLine = line.replace(
            sanitizeCommaRegxp,
            hasStrayComma[0].replace(",", ""),
          );
        }

        const cells = sanitizedLine.split(",");

        tx.push(
          schema.reduce(
            (tx, key, index) => {
              if (tx[key]) {
                return {
                  ...tx,
                  [key]: `${tx[key]} ${format(key, cells[index])}`,
                };
              } else if (key === "skip") {
                return tx;
              } else {
                return {
                  ...tx,
                  [key]: format(key, cells[index]),
                };
              }
            },
            {
              institution: args.institution,
              account: args.account,
            } as { [key: string]: string | number },
          ),
        );
      });
  });

  try {
    writeFileSync(resolve(`db/${args.out}`), JSON.stringify(tx));
    console.log(
      `Success, wrote ${tx.length} transactions to ${args.out} vs ${csvLines} transactions in the source.`,
    );
  } catch (e) {
    console.error("Folder may not exist\n", e);
  }
}
