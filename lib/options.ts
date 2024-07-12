import { OptionType } from "@lib/types";
import { MALAYSIA, STATES } from "./constants";
import { sortMsiaFirst } from "./helpers";

export const statesOptions: OptionType[] = [MALAYSIA]
  .concat(sortMsiaFirst(STATES, "key"))
  .map(state => ({
    label: state.name,
    value: state.key,
  }));

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