import { cn } from "@lib/helpers";
import { ReactNode, useMemo } from "react";
import { Speech } from "@lib/types";
import ShareButton from "./share";

/**
 * Speech Bubble
 * @overview Status: In-development
 */

export type SpeechBubbleProps = Omit<Speech, "timestamp" | "speech"> & {
  position: "left" | "right";
  party: "bn" | "gps" | "ph" | "pn" | "ydp" | string;
  timeString: string;
  children: ReactNode;
  keyword?: string;
  hansard_id: string;
  date: string;
  length: number;
};

const SpeechBubble = ({
  party,
  position,
  author,
  children,
  index,
  timeString,
  hansard_id,
  date,
  length,
}: SpeechBubbleProps) => {
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
        key={index}
        className={cn("speech", position === "left" ? "lt" : "rt")}
      >
        {/* Avatar */}
        <div className={cn("avatar-wrapper", party === "ydp" && "ydp")}>
          <div className="avatar"></div>
        </div>
        {/* Speech Bubble */}
        <div
          className={cn(
            "bubble",
            party == "ydp" && "ydp",
            length <= 222 && "max-w-prose"
          )}
        >
          {name || title ? (
            <div className="speaker-wrapper">
              <p className={cn("speaker", colour)}>
                {name}
                {title && (
                  <span className="text-zinc-500 dark:text-zinc-400 font-normal">
                    {"- " + title.slice(0, -1)}
                  </span>
                )}
              </p>
            </div>
          ) : (
            <></>
          )}
          <div className="space-y-3">{children}</div>

          <ShareButton date={date} hansard_id={hansard_id} index={index} />
          <span className="ts">{timeString}</span>
        </div>
      </div>
    </>
  );
};

export default SpeechBubble;
