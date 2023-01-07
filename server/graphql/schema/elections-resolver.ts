import { ICandidate, ICandidateArgs, IElectionResult, TPartyName } from "@types";

export const electionsResolver = (HFER_e: ICandidate[] = [], elections: IElectionResult[] = []) => {
  return {
    query: {
      candidates: (
        parent: undefined,
        {
          electionDateStart,
          electionDateEnd,
          parliament,
          province,
          riding,
          elected,
          votesMin,
          votesMax,
          votePctMin,
          votePctMax,
          firstName,
          lastName,
          party,
        }: Partial<ICandidateArgs>,
      ) => {
        let filtered = HFER_e;

        if (electionDateStart) {
          filtered = filtered.filter(
            (item) => item["Election Date"] >= electionDateStart,
          );
        }

        if (electionDateEnd) {
          filtered = filtered.filter(
            (item) => item["Election Date"] <= electionDateEnd,
          );
        }

        if (parliament) {
          filtered = filtered.filter((item) => item.Parliament === parliament);
        }

        if (province) {
          filtered = filtered.filter((item) =>
            item.Province.includes(province),
          );
        }

        if (riding) {
          filtered = filtered.filter((item) => item.Riding.includes(riding));
        }

        if (elected) {
          filtered = filtered.filter((item) => item.Elected === elected);
        }

        if (votesMin) {
          filtered = filtered.filter((item) => item.Votes >= votesMin);
        }

        if (votesMax) {
          filtered = filtered.filter((item) => item.Votes <= votesMax);
        }

        if (votePctMin) {
          filtered = filtered.filter((item) => item["Votes (%)"] >= votePctMin);
        }

        if (votePctMax) {
          filtered = filtered.filter((item) => item["Votes (%)"] <= votePctMax);
        }

        if (firstName) {
          filtered = filtered.filter((item) =>
            item["First Name"].includes(firstName),
          );
        }

        if (lastName) {
          filtered = filtered.filter((item) =>
            item["Last Name"].includes(lastName),
          );
        }

        if (party) {
          filtered = filtered.filter((item) => item.Party.includes(party));
        }

        return filtered;
      },
      elections: (
        parent: undefined,
        {
          electionDateStart,
          electionDateEnd,
          party
        }: { electionDateStart: number; electionDateEnd: number, party: TPartyName },
      ) => {
        const filtered = elections;

        if (electionDateStart) {
          
        }
      },
    },
  };
};
