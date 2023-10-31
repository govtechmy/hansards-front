import Markdown from "@components/Markdown";
import { useTranslation } from "@hooks/useTranslation";
import { cn } from "@lib/helpers";
import { useContext, useLayoutEffect, useMemo } from "react";
import rehypeRaw from "rehype-raw";
import { Speech } from "@lib/types";
import { getMatchText } from "./match-text";
import { SearchContext, SearchEventContext } from "./context";

/**
 * @overview Status: In-development
 * Speech Bubble
 */

export type SpeechBubbleProps = Omit<Speech, "timestamp" | "speech"> & {
  position: "left" | "right";
  party: "bn" | "gps" | "ph" | "pn" | "ydp" | string;
  timeString: string;
  children: string;
  keyword?: string;
};

const SpeechBubble = ({
  party,
  position,
  author,
  children,
  is_annotation,
  index,
  timeString,
  keyword,
}: SpeechBubbleProps) => {
  const { t } = useTranslation("hansard");
  const [name, title] = author ? author.split("[") : [];
  const colour = useMemo<string>(() => {
    switch (party) {
      case "bn":
        return "bn";
      case "gps":
        return "gps";
      case "ph":
        return "ph";
      case "pn":
        return "pn";
      case "ydp":
        return "text-secondary";
      default:
        return "text-zinc-500";
    }
  }, [party]);

  let { searchValue, activeId } = useContext(SearchContext);
  const { onUpdateMatchList } = useContext(SearchEventContext);

  const matchData = useMemo(
    () => getMatchText(searchValue, children),
    [searchValue, children]
  );

  useLayoutEffect(() => {
    if (typeof matchData === "object") {
      const matchIds = matchData.matches.map((_, i) => ({
        id: `${index}_${i}`,
        idCount: i,
      }));
      onUpdateMatchList(matchIds);
    }
  }, [matchData]);

  const _children = useMemo<string>(() => {
    if (typeof matchData === "string") {
      return matchData;
    } else {
      let str = "";
      for (let i = 0; i < matchData.slices.length; i++) {
        if (i === matchData.slices.length - 1) str += matchData.slices[i];
        else
          str +=
            matchData.slices[i] + `<mark id='${i}'>${matchData.matches[i]}</mark>`;
      }
      return str;
    }
  }, [children, keyword]);

  return (
    <>
      <div
        id={`${index}`}
        key={index}
        className={cn("bubble", position === "left" ? "lt" : "rt")}
      >
        <div className="flex items-end">
          <div className="usr"></div>
        </div>
        <div className="flex flex-col gap-2">
          <div className={cn("bub", party == "ydp" && "ydp")}>
            <div className="flex flex-wrap text-sm">
              <p className={cn("font-bold", colour)}>
                {name}
                {title && (
                  <span className="text-zinc-500 font-normal">
                    {"- " + title.slice(0, -1)}
                  </span>
                )}
              </p>
            </div>

            <Markdown
              className={cn(is_annotation && "a")}
              rehypePlugins={[rehypeRaw]}
              components={{
                mark(props) {
                  const { node, id, ...rest } = props;
                  const matchId = `${index}_${id}`;
                  const color = matchId === activeId ? "#DC2626" : "#2563EB";
                  return (
                    <span
                      key={index}
                      id={matchId}
                      style={{
                        backgroundColor: color,
                        color: "white",
                        display: "inline-block",
                        whiteSpace: "pre-wrap",
                      }}
                      {...rest}
                    ></span>
                  );
                },
              }}
            >
              {_children}
            </Markdown>
            {/* <p>
              <MatchText
                id={`${index}`}
                matchColor="#2563EB"
                activeColor="#DC2626"
              >
                {_c.props.children}
              </MatchText>
            </p> */}

            <button className="bt">
              <div className={"shr"} />
              {t("share")}
            </button>
            <p className={"ts"}>{timeString}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpeechBubble;
