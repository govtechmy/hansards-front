export type ElectionResult = "won" | "won_uncontested" | "lost" | "lost_deposit";

export type Individu = {
  election_name: string;
  date: string;
  seat: string;
  party: string;
  result: ElectionResult;
  votes: Record<"abs" | "perc", number>;
};

export type Parti = {
  election_name: string;
  date: string;
  party: string;
  state: string;
  seats: Record<"total" | "perc" | "won", number>;
  votes: Record<"abs" | "perc", number>;
};

export type Kawasan = {
  election_name: string;
  date: string;
  seat: string;
  name: string;
  party: string;
  majority: Record<"abs" | "perc", number>;
};

export type BaseResult = {
  election_name: string;
  date: string;
  seat: string;
  name: string;
  party: string;
  result: string;
  votes: Record<"abs" | "perc", number>;
};

export type KawasanResult = {
  votes: {
    majority: number;
    majority_perc: number;
    voter_turnout: number;
    voter_turnout_perc: number;
    votes_rejected: number;
    votes_rejected_perc: number;
  };
  data: Array<BaseResult>;
};

export type IndividuResult = KawasanResult;

export type PartiResult = Array<{
  election_name: string;
  date: string;
  party: string;
  state: string;
  seats: Record<"total" | "perc" | "won", number>;
  votes: Record<"abs" | "perc", number>;
}>;