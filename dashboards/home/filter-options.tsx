import { Dewan } from "@lib/types";

export const DEWAN_IDX_ENUM: { [key: string]: number } = {
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
export const PARTIES = [
  "BEBAS",
  "BN",
  "DAP",
  "GPS",
  "GRS",
  "KDM",
  "MUDA",
  "PAS",
  "PBM",
  "PH",
  "PKR",
  "PN",
  "SOLIDARITI",
  "WARISAN",
];

export const ALL_AGES = "all_ages";
export const AGES = ["18-29", "30-39", "40-49", "50-59", "60-69", "70"];

export const BOTH_SEXES = "both_sexes";
export const SEXES = [BOTH_SEXES, "m", "f"];

export const ALL_ETHNICITIES = "all_ethnicities";
export const ETHNICITIES = [ALL_ETHNICITIES, "bumiputera", "chinese", "indian", "other"];
