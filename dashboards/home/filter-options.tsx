import { Dewan } from "@lib/types";

export const DEWAN_INDEX_ENUM: { [key: string]: number } = {
  "dewan-rakyat": 0,
  "dewan-negara": 1,
  "kamar-khas": 2,
};

export const DEWAN_ENUM: { [key: number]: Dewan } = {
  0: "dewan-rakyat",
  1: "dewan-negara",
  2: "kamar-khas",
};

export const ALL_PARTIES = "all_parties";
export const ALL_AGES = "all_ages";
export const BOTH_SEXES = "both_sexes";
export const ALL_ETHNICITIES = "all_ethnicities";