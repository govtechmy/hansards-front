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

  const matchData = useMemo(
    () =>
      searchValue && searchValue.length > 1
        ? getMatchText(
            searchValue.trim(),
            text.replaceAll("*", "").replaceAll("**", "") // omit asterisk to allow matching during search
          )
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

  if (typeof matchData === "string")
    return inline ? md.renderInline(matchData) : md.render(matchData);
  else {
    let str = "";
    for (let i = 0; i < matchData.slices.length; i++) {
      if (i === matchData.slices.length - 1) str += matchData.slices[i];
      else {
        str += matchData.slices[i];
        str += `==${id}_${i}-${matchData.matches[i]}==`;
        if (str.includes("====")) str = str.replace("====", "==‎==");
      }
    }
    return inline ? md.renderInline(str) : md.render(str);
  }
}
