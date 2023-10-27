import Button from "@components/Button";
import Markdown from "@components/Markdown";
import { useTranslation } from "@hooks/useTranslation";
import { cn } from "@lib/helpers";
import { useMemo } from "react";
import rehypeRaw from "rehype-raw";
import { Speech } from "@lib/types";
import { MatchText } from "./match-text";

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

  // const _children = useMemo<string>(() => {
  //   if (keyword && children.includes(keyword)) {
  //     return children.replaceAll(
  //       keyword,
  //       `<span className='s'>${keyword}</span>`
  //     );
  //   }
  //   return children;
  // }, [children, keyword]);

  const _children = (
    <Markdown className={cn(is_annotation && "a")} rehypePlugins={[rehypeRaw]}>
      {children}
    </Markdown>
  );

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
            <p>
              <MatchText
                id={`${index}`}
                matchColor="#2563EB"
                activeColor="#DC2626"
              >
                {_children.props.children}
              </MatchText>
            </p>

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
