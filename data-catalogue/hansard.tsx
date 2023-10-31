import {
  At,
  Button,
  DateCard,
  HansardSidebar,
  Hero,
  Search,
  Toggle,
} from "@components/index";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ShareIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useTranslation } from "@hooks/useTranslation";
import { cn, numFormat } from "@lib/helpers";
import { NestedSpeech, Speech, Speeches } from "@lib/types";
import debounce from "lodash/debounce";
import { DateTime } from "luxon";
import { ReactNode, useContext, useRef, useState } from "react";
import SpeechBubble from "./bubble";
import { SearchContext, SearchEventContext } from "./context";
import { CiteIcon, DownloadIcon } from "@icons/index";
import { AnalyticsContext } from "@lib/contexts/analytics";
import ShareButton from "./share";

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
  speeches: Speeches;
  id: string;
}

const Hansard = ({ cycle, date, filename, speeches, id }: HansardProps) => {
  const { t } = useTranslation(["hansard", "enum", "common"]);
  const scrollRef = useRef<Record<string, HTMLElement | null>>({});
  const [narrowMode, setNarrowMode] = useState<boolean>(false);

  const { result, realtime_track } = useContext(AnalyticsContext);

  const [downloads, shares, views]: number[] =
    result && result.data && result.data.length > 0
      ? [
          result.data.find((e) => e.type === "downloads")?.counts ?? 0,
          result.data.find((e) => e.type === "shares")?.counts ?? 0,
          result.data.find((e) => e.type === "views")?.counts ?? 0,
        ]
      : [0, 0, 0];

  const { searchValue, activeCount, totalCount } = useContext(SearchContext);
  const { onSearchChange, onPrev, onNext } = useContext(SearchEventContext);

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
                id={id}
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

  const styles = {
    link_blue: "flex gap-1 items-center link-blue",
    link_dim: "hover:underline [text-underline-position:from-font]",
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
      <div className="flex flex-col w-full items-center">
        <Hero background="gold">
          <div>
            <div className="space-y-6 py-8 lg:py-12 xl:w-full">
              <div className="flex items-center font-medium text-sm text-zinc-500 whitespace-nowrap flex-wrap">
                <span className={styles.link_dim}>
                  {t("archive", {
                    context: cycle.house === 0 ? "dr" : "dn",
                  })}
                </span>
                <ChevronRightIcon className="h-5 w-5 text-zinc-500" />
                <span className={styles.link_dim}>
                  {t("term_full", { ns: "enum", n: cycle.term })}
                </span>
                <ChevronRightIcon className="h-5 w-5 text-zinc-500" />
                <span className={styles.link_dim}>
                  {t("session_full", { ns: "enum", n: cycle.session })}
                </span>
                <ChevronRightIcon className="h-5 w-5 text-zinc-500" />
                <span className={styles.link_dim}>
                  {t("meeting_full", { ns: "enum", n: cycle.meeting })}
                </span>
              </div>
              <div className="flex justify-between gap-3 lg:gap-6 items-center">
                <DateCard size="lg" date={date} />
                <div className="w-[calc(100%-78px)] gap-y-3 justify-center flex flex-col">
                  <h2 className="text-zinc-900" data-testid="hero-header">
                    {t("header", {
                      context: cycle.house === 0 ? "dr" : "dn",
                    })}
                  </h2>
                  {result && result.data && result.data.length > 0 && (
                    <p
                      className="text-zinc-500 flex gap-1.5 text-sm items-center whitespace-nowrap flex-wrap"
                      data-testid="hero-views"
                    >
                      <span>{`${numFormat(views, "compact")} ${t("views", {
                        ns: "common",
                        count: views,
                      })}`}</span>
                      •
                      <span>{`${numFormat(shares, "compact")} ${t("shares", {
                        count: shares,
                      })}`}</span>
                      •
                      <span>{`${numFormat(downloads, "compact")} ${t(
                        "downloads",
                        {
                          ns: "common",
                          count: downloads,
                        }
                      )}`}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-x-4.5 gap-y-3 whitespace-nowrap flex-wrap">
                <span className={styles.link_blue}>
                  <CiteIcon className="h-5 w-5" />
                  {t("cite")}
                </span>
                <At
                  external
                  href={`${process.env.NEXT_PUBLIC_DOWNLOAD_URL}${
                    filename.startsWith("dr") ? "dewanrakyat" : "dewannegara"
                  }/${filename}.pdf`}
                  onClick={() =>
                    realtime_track(process.env.NEXT_PUBLIC_POST_DL, id, "pdf")
                  }
                  className={styles.link_blue}
                >
                  <DownloadIcon className="h-5 w-5" />
                  {t("download", { context: "pdf" })}
                </At>
                <At
                  external
                  href={`${process.env.NEXT_PUBLIC_DOWNLOAD_URL}${
                    filename.startsWith("dr") ? "dewanrakyat" : "dewannegara"
                  }/${filename}.csv`}
                  onClick={() =>
                    realtime_track(process.env.NEXT_PUBLIC_POST_DL, id, "csv")
                  }
                  className={styles.link_blue}
                >
                  <DownloadIcon className="h-5 w-5" />
                  {t("download", { context: "csv" })}
                </At>
                <ShareButton
                  id={id}
                  trigger={(onClick) => (
                    <button className={styles.link_blue} onClick={onClick}>
                      <ShareIcon className="h-5 w-5" />
                      {t("share")}
                    </button>
                  )}
                />
              </div>
            </div>
          </div>
        </Hero>
        <div className="dark:border-washed-dark sticky top-14 z-20 flex items-center justify-between gap-1 lg:gap-3 w-full border-b bg-white py-1.5 dark:bg-black lg:px-8">
          <div className="flex gap-3 items-center w-full">
            <Search
              className="border-none py-[3.5px] w-full"
              query={searchValue}
              onChange={onSearchChange}
            />

            {searchValue && searchValue.length > 0 && (
              <Button
                variant="reset"
                className="h-fit hover:bg-washed dark:hover:bg-washed-dark text-dim group rounded-full p-1 hover:text-black dark:hover:text-white"
                onClick={() => onSearchChange}
              >
                <XMarkIcon className="text-dim h-5 w-5 group-hover:text-black dark:group-hover:text-white" />
              </Button>
            )}
          </div>
          {searchValue && searchValue.length > 0 && (
            <div className="flex gap-3 items-center">
              <p className="text-zinc-500 max-sm:text-sm whitespace-nowrap">{`${activeCount} of ${totalCount} found`}</p>
              <ChevronUpIcon className="w-5 h-5" onClick={onPrev} />
              <ChevronDownIcon className="w-5 h-5" onClick={onNext} />
            </div>
          )}
        </div>
        <div
          className={cn(
            "h-full max-w-screen-2xl px-3 md:px-4.5 lg:px-6 py-8 lg:py-12 bg-white dark:bg-zinc-900 gap-y-6 flex flex-col relative",
            narrowMode ? "w-[500px]" : "w-full"
          )}
        >
          <div
            className={cn(
              "hidden lg:block absolute top-7 right-40 p-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md shadow-floating",
              narrowMode ? "right-8" : "right-40"
            )}
          >
            <Toggle
              enabled={false}
              onStateChanged={() => {
                setNarrowMode(!narrowMode);
              }}
              label={t("narrow")}
            />
          </div>
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
