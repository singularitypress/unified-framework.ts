import { TPartyName } from "./parties";

export interface ICandidate {
  "Election Date": number;
  "Election Type": string;
  Parliament: number;
  Province: string;
  Riding: string;
  "Last Name": string;
  "First Name": string;
  Gender: string;
  Occupation: string;
  Party: string;
  Votes: number;
  "Votes (%)": number;
  Elected: boolean;
}

export interface ICandidateArgs {
  electionDateStart: number;
  electionDateEnd: number;
  parliament: number;
  province: string;
  riding: string;
  elected: boolean;
  votesMin: number;
  votesMax: number;
  votePctMin: number;
  votePctMax: number;
  firstName: string;
  lastName: string;
  party: string;
}

export type TCandidateKeys = keyof ICandidate;

export interface IElectionResult {
  date: number;
  parliament: number;
  votes: number;
  parties: {
    [key in TPartyName]: {
      name: string;
      seats: number;
      votes: number;
      votePct: number;
    };
  };
};