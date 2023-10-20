import Hero from "@components/Hero";
import { Container, DateCard, Section } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { numFormat } from "@lib/helpers";
import SpeechBubble, { SpeechBubbleProps } from "./bubble";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { ComponentProps, ReactNode } from "react";

/**
 * Hansard
 * @overview Status: In-development
 */

type Speech = {
  speech: string;
  author: string;
  timestamp: number;
};
type NestedSpeech = { [key: string]: Array<Speech | NestedSpeech> };
type Speeches = Array<Speech | NestedSpeech>;

interface HansardProps {
  date: string;
  filename: string;
  cite_count: number;
  download_count: number;
  view_count: number;
  speeches: Speeches;
}

const Hansard = ({
  date,
  filename,
  cite_count,
  download_count,
  view_count,
  speeches,
}: HansardProps) => {
  const { t } = useTranslation(["common", "enum", "hansard"]);

  const TERM = 15;
  const SESSION = 2;
  const MEETING = 0;
  const SHARES = 1_000;

  function isSpeech(_speech: Speech | NestedSpeech): _speech is Speech {
    return Object.keys(_speech).includes("speech");
  }
  const recurSpeech = (speeches: Speeches): ReactNode => {
    return speeches.map((s) => {
      if (isSpeech(s)) {
        const { speech, author, timestamp } = s;

        if (author === "ANNOTATION") {
          // let _speech = speech;
          // if (speech.startsWith("[")) _speech = _speech.slice(1);
          // if (speech.endsWith("]")) _speech = _speech.slice(0, -1);
          return (
            <p className="text-zinc-900 dark:text-white text-center italic">
              {speech}
            </p>
          );
        } else if (["Tuan Yang di-Pertua"].includes(author))
          return (
            <SpeechBubble
              party="ydp"
              position="right"
              author={author}
              speech={speech}
            />
          );
        else
          return (
            <SpeechBubble
              party=""
              position="left"
              author={author}
              speech={speech}
            />
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
    <>
      <Hero background="gold">
        <div>
          <div className="space-y-6 py-12 xl:w-full">
            <span className="flex items-center font-medium text-sm text-zinc-500 underline [text-underline-position:from-font]">
              {t("archive", { ns: "hansard", context: "dewan_rakyat" })}
              <ChevronRightIcon className="h-5 w-5 text-zinc-500" />
              {t("term_full", { ns: "enum", n: TERM })}
              <ChevronRightIcon className="h-5 w-5 text-zinc-500" />
              {t("session_full", { ns: "enum", n: SESSION })}
              <ChevronRightIcon className="h-5 w-5 text-zinc-500" />
              {t("meeting_full", { ns: "enum", n: MEETING })}
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
          <div className="bg-white dark:bg-zinc-950 lg:w-3/4 xl:w-4/5">
            {recurSpeech(speeches)}
          </div>
        </Section>
      </Container>
    </>
  );
};

export default Hansard;
