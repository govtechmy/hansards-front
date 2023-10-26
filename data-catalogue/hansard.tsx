import { Container, DateCard, Hero, HansardSidebar } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { numFormat } from "@lib/helpers";
import SpeechBubble from "./bubble";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { ReactNode, useRef } from "react";
import { DateTime } from "luxon";
import { NestedSpeech, Speech, Speeches } from "@lib/types";

/**
 * Hansard
 * @overview Status: In-development
 */

interface HansardProps {
  cycle: {
    house: number;
    term: number;
    session: number;
    meeting: number;
  };
  date: string;
  filename: string;
  cite_count: number;
  download_count: number;
  view_count: number;
  speeches: Speeches;
}

const Hansard = ({
  cycle,
  date,
  filename,
  cite_count,
  download_count,
  view_count,
  speeches,
}: HansardProps) => {
  const { t } = useTranslation(["common", "enum", "hansard"]);
  const scrollRef = useRef<Record<string, HTMLElement | null>>({});

  const SHARES = 1_000;

  let curr = DateTime.fromISO("00:00");
  const recurSpeech = (speeches: Speeches, prev_id?: string): ReactNode => {
    return speeches.map((s) => {
      if (isSpeech(s)) {
        const { speech, author, timestamp, is_annotation, index } = s;

        const hr = String(timestamp).slice(0, 2);
        const mn = String(timestamp).slice(2, 4);
        const _timestamp = DateTime.fromISO(`${hr}:${mn}`);
        const prev = curr; // temp store
        if (_timestamp > curr) {
          curr = _timestamp;
        }

        const timeString = _timestamp.toLocaleString(DateTime.TIME_SIMPLE, {
          locale: "en-US",
        });
        // FIXME: overnight timestamps 
        return (
          <>
            {!_timestamp.hasSame(prev, "minute") && (
              <p className="text-zinc-500 text-center italic">{timeString}</p>
            )}
            {author === "ANNOTATION" ? (
              <p className="text-zinc-900 dark:text-white text-center italic">
                {speech}
              </p>
            ) : (
              <SpeechBubble
                party={["Tuan Yang di-Pertua"].includes(author) ? "ydp" : ""}
                position={
                  ["Tuan Yang di-Pertua"].includes(author) ? "right" : "left"
                }
                author={author}
                speech={speech}
                is_annotation={is_annotation}
                timeString={timeString}
                index={index}
              />
            )}
          </>
        );
      } else {
        const keys = Object.keys(s);
        const key = keys[0];
        const id = prev_id ? `${prev_id}_${key}` : key;
        return (
          <div
            ref={(ref) => (scrollRef.current[id] = ref)}
            className="flex flex-col gap-y-3 lg:gap-y-6"
          >
            <p
              onClick={() => {
                scrollRef.current[id]?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className="text-zinc-900 dark:text-white text-center font-bold py-3 lg:sticky top-14 bg-white dark:bg-zinc-900 z-10"
            >
              {key}
            </p>
            {recurSpeech(s[key], id)}
          </div>
        );
      }
    });
  };

  return (
    <HansardSidebar
      speeches={speeches}
      onClick={(selected) => {
        scrollRef.current[selected]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }}
    >
      <div className="flex flex-col w-full">
        <Hero background="gold">
          <div>
            <div className="space-y-6 py-12 xl:w-full">
              <span className="flex items-center font-medium text-sm text-zinc-500 underline [text-underline-position:from-font]">
                {t("archive", {
                  ns: "hansard",
                  context: cycle.house === 0 ? "dewan_rakyat" : "dewan_negara",
                })}
                <ChevronRightIcon className="h-5 w-5 text-zinc-500" />
                {t("term_full", { ns: "enum", n: cycle.term })}
                <ChevronRightIcon className="h-5 w-5 text-zinc-500" />
                {t("session_full", { ns: "enum", n: cycle.session })}
                <ChevronRightIcon className="h-5 w-5 text-zinc-500" />
                {t("meeting_full", { ns: "enum", n: cycle.meeting })}
              </span>
              <div className="flex justify-between gap-3 lg:gap-6 items-center">
                <DateCard size="lg" date={date} />
                <div className="w-[calc(100%-78px)] gap-y-3 justify-center flex flex-col">
                  <h2 className="text-zinc-900" data-testid="hero-header">
                    {t("hero.header")}
                  </h2>
                  <p
                    className="text-zinc-500 flex gap-1.5 text-sm items-center whitespace-nowrap flex-wrap"
                    data-testid="hero-views"
                  >
                    <span>{`${numFormat(view_count, "compact")} ${t("views", {
                      count: view_count,
                    })}`}</span>
                    •
                    <span>{`${numFormat(SHARES, "compact")} ${t("shares", {
                      count: SHARES,
                    })}`}</span>
                    •
                    <span>{`${numFormat(download_count, "compact")} ${t(
                      "downloads",
                      {
                        count: download_count,
                      }
                    )}`}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-3"></div>
            </div>
          </div>
        </Hero>
        <div className="h-full w-full max-w-screen-2xl px-3 md:px-4.5 lg:px-6 py-8 lg:py-12 bg-white dark:bg-zinc-900 gap-y-6 flex flex-col">
          {recurSpeech(speeches)}
        </div>
      </div>
    </HansardSidebar>
  );
};

export default Hansard;

export function isSpeech(_speech: Speech | NestedSpeech): _speech is Speech {
  return (
    Object.keys(_speech).includes("speech") &&
    Object.keys(_speech).includes("author") &&
    Object.keys(_speech).includes("timestamp")
  );
}
