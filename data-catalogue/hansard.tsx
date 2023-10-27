import {
  DateCard,
  Hero,
  HansardSidebar,
  Search,
  Button,
} from "@components/index";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useTranslation } from "@hooks/useTranslation";
import { numFormat } from "@lib/helpers";
import { NestedSpeech, Speech, Speeches } from "@lib/types";
import { DateTime } from "luxon";
import { ReactNode, useContext, useRef } from "react";
import SpeechBubble from "./bubble";
import { SearchContext, SearchEventContext } from "./context";

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

  const { searchValue, activeCount, totalCount } = useContext(SearchContext);
  const { onSearchChange, onPrev, onNext } = useContext(SearchEventContext);

  const SHARES = 1_000;

  let curr = DateTime.fromISO("00:00");
  const recurSpeech = (
    speeches: Speeches,
    keyword?: string,
    prev_id?: string
  ): ReactNode => {
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
                is_annotation={is_annotation}
                timeString={timeString}
                index={index}
                keyword={keyword}
              >
                {speech}
              </SpeechBubble>
            )}
          </>
        );
      } else {
        const keys = Object.keys(s);
        const key = keys[0];
        const id = prev_id ? `${prev_id}_${key}` : key;
        return (
          <div
            key={key}
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
              className="text-zinc-900 dark:text-white text-center font-bold py-3 lg:sticky top-28 bg-white dark:bg-zinc-900 z-10"
            >
              {key}
            </p>
            {recurSpeech(s[key], keyword, id)}
          </div>
        );
      }
    });
  };

  //   const bold = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  //   const italic = /\*(.+?)\*/g;

  //   const getNodeText = (node: ReactNode): string => {
  //     if (node == null) return "";
  //
  //     switch (typeof node) {
  //       case "string":
  //       case "number":
  //         return node.toString().replaceAll(bold, "$1").replaceAll(italic, "$1") + "\n\n";

  //       case "boolean":
  //         return "";

  //       case "object": {
  //         if (node instanceof Array) return node.map(getNodeText).join("");

  //         if ("props" in node) return getNodeText(node.props.author) + getNodeText(node.props.children);
  //       }

  //       default:
  //         console.warn("Unresolved `node` of type:", typeof node, node);
  //         return "";
  //     }
  //   };

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
              <span className="flex items-center font-medium text-sm text-zinc-500 underline [text-underline-position:from-font] whitespace-nowrap flex-wrap">
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
        <div className="dark:border-washed-dark sticky top-14 z-10 flex items-center justify-between gap-2 border-b bg-white py-1.5 dark:bg-black lg:px-8">
          <div className="flex w-[400px]">
            <div className="flex-1">
              <Search
                className="border-none py-[3.5px]"
                query={searchValue}
                onChange={onSearchChange}
              />
            </div>
            {searchValue && searchValue.length > 0 && (
              <Button
                variant="reset"
                className="hover:bg-washed dark:hover:bg-washed-dark text-dim group block rounded-full p-1 hover:text-black dark:hover:text-white"
                onClick={() => onSearchChange}
              >
                <XMarkIcon className="text-dim h-5 w-5 group-hover:text-black dark:group-hover:text-white" />
              </Button>
            )}
          </div>
          {searchValue && searchValue.length > 0 && (
          <div className="flex gap-3">
            <p>{`${activeCount} of ${totalCount} found`}</p>
            <ChevronUpIcon className="w-4.5 h-4.5" onClick={onPrev}/>
            <ChevronDownIcon className="w-4.5 h-4.5" onClick={onNext}/>
          </div>
          )}
        </div>
        {/* <p className="whitespace-pre-line">{getNodeText(recurSpeech(speeches, search ?? ""))}</p> */}
        <div className="h-full w-full max-w-screen-2xl px-3 md:px-4.5 lg:px-6 py-8 lg:py-12 bg-white dark:bg-zinc-900 gap-y-6 flex flex-col">
          {recurSpeech(speeches, searchValue)}
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
