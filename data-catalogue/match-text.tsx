const MARK = "__$CTRL_F$__";

function escapeStr(str: string) {
  return `${str}`.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
}

export function getMatchText(
  keyword: string,
  text: string,
  ignorecase: boolean = true
) {
  let keywordStr = keyword;
  let textStr = text;
  if (typeof keyword === "number") {
    keywordStr = `${keyword}`;
  }
  if (typeof text === "number") {
    textStr = `${text}`;
  }
  if (
    typeof keywordStr !== "string" ||
    !keywordStr.trim() ||
    typeof textStr !== "string" ||
    !textStr.trim() ||
    !textStr.toLowerCase().includes(keywordStr.toLowerCase()) // case insensitive
  ) {
    return text;
  }
  const regexp = new RegExp(escapeStr(keywordStr), ignorecase ? "gi" : "g");
  const matches: string[] = []; // save matched string, we will use this to overwrite keywordStr in the result string
  const textWithMark = textStr.replace(regexp, (match) => {
    matches.push(match);
    return MARK;
  });
  const slices = textWithMark.split(MARK);
  const data = {
    slices,
    matches,
  };
  return data;
}