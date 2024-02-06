import { useContext } from "react";
import { SearchContext } from "./context";
import { COLOR } from "@lib/constants";

type MatchData = string | Record<"slices" | "matches", string[]>;

export function highlightKeyword(matchData: MatchData, id: string) {
  if (typeof matchData === "string") return matchData;
  else {
    const { activeId } = useContext(SearchContext);
    return (
      <p>
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
      </p>
    );
  }
}
