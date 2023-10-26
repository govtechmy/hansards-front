import Button from "@components/Button";
import Markdown from "@components/Markdown";
import { useTranslation } from "@hooks/useTranslation";
import { cn } from "@lib/helpers";
import { useMemo } from "react";
import rehypeRaw from "rehype-raw";
import { Speech } from "@lib/types";

/**
 * @overview Status: In-development
 * Speech Bubble
 */

export type SpeechBubbleProps = Omit<Speech, "timestamp"> & {
  position: "left" | "right";
  party: "bn" | "gps" | "ph" | "pn" | "ydp" | string;
  timeString: string;
};

const SpeechBubble = ({
  party,
  position,
  author,
  speech,
  is_annotation,
  index,
  timeString,
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

  return (
    <>
      <div
        id={`${index}`}
        className={cn(
          "bubble",
          position === "left" ? "lt" : "rt"
        )}
      >
        <div className="flex items-end">
          <div className="usr"></div>
        </div>
        <div className="flex flex-col gap-2">
          <div className={cn("bub", party == "ydp" && "ydp")}>
            <p className="flex flex-wrap text-sm">
              <p className={cn("font-bold", colour)}>
                {name}
                {title && (
                  <span className="text-zinc-500 font-normal">
                    {"- " + title.slice(0, -1)}
                  </span>
                )}
              </p>
            </p>
            <Markdown
              className={cn(is_annotation && "a")}
              rehypePlugins={[rehypeRaw]}
            >
              {speech}
            </Markdown>
            <button className={cn("bt")}>
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
