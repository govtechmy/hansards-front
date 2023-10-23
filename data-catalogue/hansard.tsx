import {
  Container,
  DateCard,
  Hero,
  HansardSidebar,
  Section,
} from "@components/index";
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
  const { t, i18n } = useTranslation(["common", "enum", "hansard"]);
  const scrollRef = useRef<Record<string, HTMLElement | null>>({});

  const SHARES = 1_000;

  function isSpeech(_speech: Speech | NestedSpeech): _speech is Speech {
    return Object.keys(_speech).includes("speech");
  }

  let current = DateTime.fromISO("00:00");
  const recurSpeech = (speeches: Speeches): ReactNode => {
    return speeches.map((s) => {
      if (isSpeech(s)) {
        const { speech, author, timestamp, is_annotation } = s;

        const hr = String(timestamp).slice(0, 2);
        const mn = String(timestamp).slice(2, 4);
        const _timestamp = DateTime.fromISO(`${hr}:${mn}`);

        const prev = current;
        if (_timestamp > current) {
          current = _timestamp;
        }

        return (
          <>
            {!_timestamp.hasSame(prev, "minute") && (
              <p className="text-zinc-500 text-center italic">
                {_timestamp.toLocaleString(DateTime.TIME_SIMPLE, {
                  locale: i18n.language,
                })}
              </p>
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
                isAnnotation={is_annotation}
              />
            )}
          </>
        );
      } else {
        const keys = Object.keys(s);
        const key = keys[0];

        return (
          <div className="px-0 py-6 lg:p-8 flex flex-col gap-y-3 lg:gap-y-6">
            <p className="text-zinc-900 dark:text-white text-center font-bold">
              {key}
            </p>
            {recurSpeech(s[key])}
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
          block: "center",
        });
      }}
    >
      <div className="flex flex-col">
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

        <Container>
          <Section>
            <div className="bg-white dark:bg-zinc-900">
              {recurSpeech(speeches)}
            </div>
          </Section>
        </Container>
      </div>
    </HansardSidebar>
  );
};

export default Hansard;
