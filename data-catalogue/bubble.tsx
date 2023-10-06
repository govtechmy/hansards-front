import Markdown from "@components/Markdown";
import { UserIcon } from "@heroicons/react/24/solid";
import { clx } from "@lib/helpers";
import { useMemo } from "react";

/**
 * @overview Status: In-development
 * Speech Bubble
 */

type Speaker = {
  name: string;
  designation: string;
};

export type SpeechBubbleProps = {
  position: "left" | "right";
  party: "bn" | "gps" | "ph" | "pn" | "ydp" | string;
  speaker: Speaker;
  speech: string;
};

const SpeechBubble = ({ party, position, speaker, speech }: SpeechBubbleProps) => {
  const colour = useMemo<string>(() => {
    switch (party) {
      case "bn":
        return "text-[#000080] dark:text-[#006AFF]";
      case "gps":
        return "text-[#FF9B0E]";
      case "ph":
        return "text-[#D7282F] dark:text-[#DF3134]";
      case "pn":
        return "text-[#003152] dark:text-[#0080AF]";
      case "ydp":
        return "text-secondary";
      default:
        return "text-[#A7A7A7]";
    }
  }, [party]);

  const _speech = speech.split(".\n");
  console.log(_speech);
  console.log(speech.length);
  return (
    <>
      <div
        className={clx(
          "flex gap-x-3",
          position === "left" ? "flex-row pr-12" : "flex-row-reverse pl-12"
        )}
      >
        <div className="flex w-min h-auto items-end">
          <div className="h-9 w-9 border border-slate-200 dark:border-zinc-800 rounded-full flex justify-center items-center bg-white dark:bg-zinc-900">
            <UserIcon className="w-7 h-7 text-slate-200 dark:text-zinc-700" />
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          {_speech.map((speech, i) => (
            <div
              className={clx(
                "shadow-button border rounded-xl dark:border-zinc-800 px-4.5 py-3 flex flex-col gap-y-1 bg-white dark:bg-[#000000]",
                speech.length > 100 && "w-full"
              )}
            >
              {i === 0 && (
                <div className="flex gap-2">
                  <p className={clx("font-bold text-sm", colour)}>
                    {speaker.name}
                  </p>
                  <p className="text-sm text-zinc-500">{speaker.designation}</p>
                </div>
              )}
              <Markdown>
                {speech.concat(i < _speech.length - 1 ? "." : "")}
              </Markdown>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SpeechBubble;
