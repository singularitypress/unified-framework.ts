import { ICandidate, IElectionResult, TCandidateKeys } from "@types";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const csv = readFileSync(resolve(__dirname, "..", "elections", "HFER_e.csv"), {
  encoding: "utf-8",
});

const rows = csv.split("\n");
const keys: TCandidateKeys[] = (
  ((rows.shift() ?? "").split(",") ?? []) as any[]
).map((item) => item.replace("\r", ""));
const candidates = rows.reduce((currList, currRow) => {
  const candidate: Partial<ICandidate> = keys.reduce((obj, key, index) => {
    const value = (
      currRow.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/g)[index] ?? ""
    ).replace("\r", "");

    switch (key) {
      case "Election Date":
        return {
          ...obj,
          [key]: new Date(value).getTime(),
        };
      case "Elected":
        return {
          ...obj,
          [key]: !!parseInt(value),
        };
      case "Gender":
        return {
          ...obj,
          [key]: !value ? "n/a" : value,
        };
      case "Votes":
      case "Votes (%)":
        return {
          ...obj,
          [key]: value === "accl." || !value ? 0 : parseInt(value),
        };
      case "Parliament":
        return {
          ...obj,
          [key]: parseFloat(value),
        };
      default:
        return {
          ...obj,
          [key]: value,
        };
    }
  }, {} as ICandidate);
  return [...currList, candidate as ICandidate];
}, [] as ICandidate[]);

candidates.pop();

const electionResults = candidates
  .filter((candidate) => candidate["Election Type"] === "Gen")
  .reduce((results, candidate) => {
    const votes = (results[candidate.Parliament]?.votes ?? 0) + candidate.Votes;
    const partyKey = candidate.Party.replace(/\W/g, "");
    return {
      ...results,
      [candidate.Parliament]: {
        date: candidate["Election Date"],
        parliament: candidate.Parliament,
        votes,
        parties: {
          ...results[candidate.Parliament]?.parties,
          [partyKey]: {
            name: candidate.Party,
            seats:
              (results[candidate.Parliament]?.parties[candidate.Party]?.seats ??
                0) + (candidate.Elected ? 1 : 0),
            votes:
              (results[candidate.Parliament]?.parties[candidate.Party]?.votes ??
                0) + candidate.Votes,
            votePct:
              ((results[candidate.Parliament]?.parties[candidate.Party]
                ?.votes ?? 0) +
                candidate.Votes) /
              votes,
          },
        },
      },
    };
  }, {} as IElectionResult);

const partyNames = [
  ...new Set(candidates.map(({ Party }) => Party.replace(/\W/g, ""))),
];

writeFileSync(
  resolve(__dirname, "..", "elections", "HFER_e.json"),
  JSON.stringify(candidates),
);

writeFileSync(
  resolve(__dirname, "..", "elections", "elections.json"),
  JSON.stringify(electionResults),
);

writeFileSync(
  resolve(__dirname, "..", "server", "graphql", "types", "parties.ts"),
`
export const partyNames = /* GraphQL */\`
  enum PartyNames {
  ${partyNames.join("\n\t\t")}
  }
\`
`
);

writeFileSync(
  resolve(__dirname, "..", "@types", "parties.ts"),
`
export type TPartyName = ${partyNames.map((item) => `"${item}"`).join(" | ")}
`
);
