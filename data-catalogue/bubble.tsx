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
        className={cn("bubble", position === "left" ? "lt" : "rt")}
      >
        {/* Speaker Picture */}
        <div className="flex items-end">
          <div className="usr"></div>
        </div>
        {/* Speech Bubble */}
        <div>
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

            {children}
            <ShareButton date={date} hansard_id={hansard_id} index={index} />
            <span className="ts">{timeString}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpeechBubble;
