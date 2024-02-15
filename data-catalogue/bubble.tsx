import { cn } from "@lib/helpers";
import { ReactNode } from "react";
import ShareButton from "./share";
import ImageWithFallback from "@components/ImageWithFallback";

/**
 * Speech Bubble
 * @overview Status: In-development
 */

export type SpeechBubbleProps = {
  speaker: ReactNode;
  children: ReactNode;
  date: string;
  hansard_id: string;
  index: number;
  isYDP: boolean;
  length: number;
  speech_id: string;
  timeString: string;
};

const SpeechBubble = ({
  speaker,
  children,
  date,
  hansard_id,
  index,
  isYDP,
  length,
  speech_id,
  timeString,
}: SpeechBubbleProps) => {
  return (
    <>
      <div id={`${index}`} key={speech_id} className={cn("s", isYDP && "ydp")}>
        {/* Avatar */}
        <div className={cn("aw", isYDP && "ydp")}>
          <div className="a">
            <ImageWithFallback
              fallback={<div className="border border-border w-9 h-9 rounded-full" />}
              src={`/static/`}
              width={36}
              height={1}
              alt={``}
              className="p"
              priority={index <= 5}
            />
          </div>
        </div>
        {/* Bubble */}
        <div
          className={cn("b", isYDP && "ydp", length <= 222 && "max-w-prose")}
        >
          {speaker ? <div className="nw">{speaker}</div> : <></>}
          <div className="space-y-3">{children}</div>

          <ShareButton date={date} hansard_id={hansard_id} index={`${index}`} />
          <span className="t">{timeString}</span>
        </div>
      </div>
    </>
  );
};

export default SpeechBubble;
