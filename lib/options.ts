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
  "UMNO",
  "PKR",
  "DAP",
  "PAS",
  "BERSATU",
  "PBB",
  "MCA",
  "MIC",
  "AMANAH",
  "WARISAN",
  "MUDA",
];
