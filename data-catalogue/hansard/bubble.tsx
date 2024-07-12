import { cn } from "@lib/helpers";
import { ReactNode } from "react";
import ShareButton from "./share";
import ImageWithFallback from "@components/ImageWithFallback";

/**
 * Speech Bubble
 * @overview Status: In-development
 */

export type SpeechBubbleProps = {
  children: ReactNode;
  date: string;
  hansard_id: string;
  index: number;
  isYDP: boolean;
  length: number;
  side: boolean;
  speaker: ReactNode;
  speech_id: string;
  timeString: string;
  uid: number;
};

const SpeechBubble = ({
  children,
  date,
  hansard_id,
  index,
  isYDP,
  length,
  side,
  speaker,
  speech_id,
  timeString,
  uid,
}: SpeechBubbleProps) => {
  return (
    <>
      <div id={`${index}`} key={speech_id} className={cn("s", side && "r")}>
        {/* Avatar */}
        <div className={cn("w", side && "r")}>
          <div className="a">
            {/* <ImageWithFallback
              fallback={
                <div className="border border-border size-9 rounded-full" />
              }
              src={`/static/`}
              width={36}
              height={1}
              alt={``}
              className="p"
              priority={index <= 5}
            /> */}
            <img alt={`${uid}`} className="p" src={`/mp/${uid}.jpg`} width={36} height={36}/>
          </div>
        </div>
        {/* Bubble */}
        <div
          className={cn("b", isYDP && "ydp", length <= 222 && "x")}
        >
          {speaker ? <div className="m">{speaker}</div> : <></>}
          {children}

          <ShareButton date={date} hansard_id={hansard_id} index={`${index}`} />
          <span className="t">{timeString}</span>
        </div>
      </div>
    </>
  );
};

export default SpeechBubble;
