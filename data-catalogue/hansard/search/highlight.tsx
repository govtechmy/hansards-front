import { useContext, useEffect, useMemo } from "react";
import { SearchContext, SearchEventContext } from "./context";
import { getMatchText } from "./match-text";
import { Remarkable } from "remarkable";
import RemarkableReactRenderer from "remarkable-react";
import { cn } from "@lib/helpers";

export function highlightKeyword(text: string, id: string) {
  const { activeId, searchValue } = useContext(SearchContext);
  const { onUpdateMatchList } = useContext(SearchEventContext);

  const matchData = useMemo(
    () =>
      searchValue && searchValue.length > 1
        ? getMatchText(searchValue, text)
        : text,
    [searchValue, text]
  );

  useEffect(() => {
    if (typeof matchData === "object") {
      const matchIds = matchData.matches.map((_, i) => ({
        id: `${id}_${i}`,
        idCount: i,
      }));
      onUpdateMatchList(matchIds);
    } else onUpdateMatchList([]);
  }, [matchData]);

  if (typeof matchData === "string") return <>{text}</>;
  else {
    return (
      <>
        {matchData.slices.map((speech, i) => {
          const matchId = `${id}_${i}`;
          const isHighlighted = matchId === activeId;

          return i < matchData.slices.length ? (
            <>
              {speech}
              <mark
                key={i}
                id={matchId}
                className={
                  isHighlighted
                    ? "bg-bg-primary-500 text-white"
                    : "bg-[#DDD6B0] text-black"
                }
              >
                {matchData.matches[i]}
              </mark>
            </>
          ) : (
            speech
          );
        })}
      </>
    );
  }
}

export function highlightKeywordMarkdown(
  text: string,
  id: string,
  inline: boolean = false
) {
  const { searchValue } = useContext(SearchContext);
  const { onUpdateMatchList } = useContext(SearchEventContext);
  const matches = useMemo(() => kmpSearch(text, searchValue), [searchValue]);
  const highlighted = highlightText(text, matches, searchValue.length, id);

  useEffect(() => {
    if (matches.length > 0) {
      const matchIds = matches.map((_, i) => ({
        id: `${id}_${i}`,
        idCount: i,
      }));
      onUpdateMatchList(matchIds);
    }
  }, [matches]);

  // const matchData = useMemo(
  //   () =>
  //     searchValue && searchValue.length > 1
  //       ? getMatchText(
  //           searchValue.trim(),
  //           text.replaceAll("*", "").replaceAll("**", "") // omit asterisk to allow matching during search
  //         )
  //       : text,
  //   [searchValue, text]
  // );

  // useEffect(() => {
  //   if (typeof matchData === "object") {
  //     const matchIds = matchData.matches.map((_, i) => ({
  //       id: `${id}_${i}`,
  //       idCount: i,
  //     }));
  //     onUpdateMatchList(matchIds);
  //   } else onUpdateMatchList([]);
  // }, [matchData]);

  const md = new Remarkable();
  md.inline.ruler.enable(["mark"]);
  md.renderer = new RemarkableReactRenderer({
    components: {
      mark: ({ children }: { children: string[] }) => {
        let { activeId } = useContext(SearchContext);
        const child = children[0];
        const separator_idx = child.indexOf("-");
        const matchId = child.slice(0, separator_idx);
        const isHighlighted = matchId === activeId;
        return (
          <mark
            id={matchId}
            className={cn(
              isHighlighted
                ? "bg-bg-primary-500 text-white"
                : "bg-[#DDD6B0] text-black"
            )}
          >
            {child.slice(separator_idx + 1)}
          </mark>
        );
      },
    },
  });

  // if (typeof matchData === "string")
  //   return inline ? md.renderInline(matchData) : md.render(matchData);
  // else {
  //   let str = "";
  //   for (let i = 0; i < matchData.slices.length; i++) {
  //     if (i === matchData.slices.length - 1) str += matchData.slices[i];
  //     else {
  //       str += `${matchData.slices[i]}==${id}_${i}-${matchData.matches[i]}==`;
  //       if (str.includes("====")) str = str.replace("====", "==‎==");
  //     }
  //   }
  //   return inline ? md.renderInline(str) : md.render(str);
  // }

  const render = (text: string) =>
    inline ? md.renderInline(text) : md.render(text);

  if (searchValue.length < 2) return render(text);
  return render(highlighted);
}

// KMP search: finds all starting indices of `pattern` in `text`
function kmpSearch(text: string, pattern: string): number[] {
  const n = text.length;
  const m = pattern.length;
  if (m === 0) return [];

  const lps: number[] = new Array(m).fill(0);
  let j = 0;

  // Build LPS (Longest Prefix Suffix) table
  for (let i = 1; i < m; i++) {
    while (j > 0 && pattern[i] !== pattern[j]) {
      j = lps[j - 1];
    }
    if (pattern[i] === pattern[j]) {
      j++;
      lps[i] = j;
    }
  }

  // Search phase
  const result: number[] = [];
  j = 0;
  for (let i = 0; i < n; i++) {
    while (j > 0 && text[i] !== pattern[j]) {
      j = lps[j - 1];
    }
    if (text[i] === pattern[j]) {
      j++;
    }
    if (j === m) {
      result.push(i - m + 1);
      j = lps[j - 1];
    }
  }

  return result;
}

// Highlight matches in the text with <mark> tags
function highlightText(
  text: string,
  indices: number[],
  keywordLength: number,
  id: string
): string {
  if (indices.length === 0) return text;

  let result = "";
  let lastIndex = 0;

  indices.map((index, i) => {
    result += text.slice(lastIndex, index);
    result += `==${id}_${i}-` + text.slice(index, index + keywordLength) + "==";
    lastIndex = index + keywordLength;
  });

  result += text.slice(lastIndex);
  if (result.includes("====")) result = result.replaceAll("====", "==‎==");
  return result;
}
