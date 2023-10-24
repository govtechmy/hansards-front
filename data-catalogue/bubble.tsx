import Button from "@components/Button";
import Markdown from "@components/Markdown";
import { ShareIcon } from "@heroicons/react/20/solid";
import { UserIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "@hooks/useTranslation";
import { ShareButton } from "@icons/index";
import { cn } from "@lib/helpers";
import { useMemo } from "react";

/**
 * @overview Status: In-development
 * Speech Bubble
 */

export type SpeechBubbleProps = {
  position: "left" | "right";
  party: "bn" | "gps" | "ph" | "pn" | "ydp" | string;
  author: string;
  speech: string;
  isAnnotation: boolean;
};

const SpeechBubble = ({
  party,
  position,
  author,
  speech,
  isAnnotation,
}: SpeechBubbleProps) => {
  const { t } = useTranslation("hansard");
  const [name, title] = author ? author.split("[") : [];
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

  // const _speech = speech.split("");

  return (
    <>
      <div
        className={cn(
          "flex gap-x-3",
          position === "left" ? "flex-row pr-12" : "flex-row-reverse pl-12"
        )}
      >
        <div className="flex w-min h-auto items-end">
          <div className="h-9 w-9 border border-slate-200 dark:border-zinc-800 rounded-full flex justify-center items-center bg-white dark:bg-zinc-950">
            <UserIcon className="w-7 h-7 text-slate-200 dark:text-zinc-700" />
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          {/* {_speech.map((speech, i) => ( */}
          <div
            className={cn(
              "relative group flex flex-col px-3 sm:px-4.5 py-3 gap-y-1 whitespace-pre-line",
              party == "ydp" ? "bg-[#FAF8F0] dark:bg-[#3E3713]" : "bg-slate-50 dark:bg-[#000000]",
              "hover:bg-white dark:hover:bg-zinc-800 hover:shadow-floating dark:hover:shadow-[0_6px_24px_rgba(255,255,255,20%)]",
              "border border-transparent rounded-xl hover:border-slate-200 hover:dark:border-zinc-800",
              speech.length > 100 && "w-full"
            )}
          >
            {/* {i === 0 && ( */}
            <div className="flex gap-x-2 flex-col sm:flex-row">
              <p className={cn("font-bold text-sm", colour)}>{name}</p>
              <p className="text-sm text-zinc-500">
                {title ? title.slice(0, -1) : ""}
              </p>
            </div>
            {/* )} */}
            <Markdown className={isAnnotation ? "italic text-zinc-500" : ""}>
              {speech}
              {/* {speech.concat(i < _speech.length - 1 ? "." : "")} */}
            </Markdown>
            <div
              className={cn(
                "flex select-none items-center gap-1 text-sm font-medium outline-none transition px-3 py-1.5",
                "invisible group-hover:visible absolute bottom-1.5 right-3.5",
                "transition-transform group-hover:translate-x-2 duration-300",
                "[mask-image:linear-gradient(279deg,#FFF_80%,rgba(0,0,0,0)_95%)]",
                "bg-white dark:bg-zinc-900",
                "text-blue-600 hover:text-primary"
              )}
            >
              <ShareIcon className="text-blue-600 h-5 w-5" />
              {/* <ShareButton /> */}
              {t("share")}
            </div>
          </div>
          {/* ))} */}
        </div>
      </div>
    </>
  );
};

export default SpeechBubble;
