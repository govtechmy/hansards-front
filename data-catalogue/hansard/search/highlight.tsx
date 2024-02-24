import { COLOR } from "@lib/constants";
import { useContext, useEffect, useMemo } from "react";
import { SearchContext, SearchEventContext } from "./context";
import { getMatchText } from "./match-text";

export function highlightKeyword(text: string, id: string) {
  const { searchValue, activeId } = useContext(SearchContext);
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
          const backgroundColor = isHighlighted ? COLOR.PRIMARY : "#DDD6B0";
          const color = isHighlighted ? COLOR.WHITE : COLOR.BLACK;

          return i < matchData.slices.length ? (
            <>
              {speech}
              <span
                key={i}
                id={matchId}
                style={{
                  backgroundColor,
                  color,
                }}
              >
                {matchData.matches[i]}
              </span>
            </>
          ) : (
            speech
          );
        })}
      </>
    );
  }
}
