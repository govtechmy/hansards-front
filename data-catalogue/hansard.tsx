import {
  At,
  Button,
  DateCard,
  HansardSidebar,
  Hero,
  Markdown,
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
import { useAnalytics } from "@hooks/useAnalytics";
import { useTranslation } from "@hooks/useTranslation";
import { CiteIcon, DownloadIcon } from "@icons/index";
import { cn, numFormat } from "@lib/helpers";
import { NestedSpeech, Speech, Speeches } from "@lib/types";
import { DateTime } from "luxon";
import {
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import rehypeRaw from "rehype-raw";

import SpeechBubble from "./bubble";
import { SearchContext, SearchEventContext } from "./context";
import ShareButton from "./share";
import { getMatchText } from "./match-text";

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
  const [query, setQuery] = useState<string>("");

  const { counts, download } = useAnalytics(id);
  const [downloads, shares, views]: number[] =
    counts && counts.length > 0
      ? [
          counts.find((e) => e.type === "downloads")?.counts ?? 0,
          counts.find((e) => e.type === "shares")?.counts ?? 0,
          counts.find((e) => e.type === "views")?.counts ?? 0,
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
        if (
          !_timestamp.hasSame(curr, "hour") &&
          !_timestamp.hasSame(curr, "minute")
        ) {
          curr = _timestamp;
        }

        const timeString = _timestamp.toLocaleString(DateTime.TIME_SIMPLE, {
          locale: "en-US",
        });

        let { searchValue, activeId } = useContext(SearchContext);
        const { onUpdateMatchList } = useContext(SearchEventContext);

        const matchData = useMemo(
          () => getMatchText(searchValue, speech),
          [searchValue, speech]
        );

        useEffect(() => {
          if (typeof matchData === "object") {
            const matchIds = matchData.matches.map((_, i) => ({
              id: `${index}_${i}`,
              idCount: i,
            }));
            onUpdateMatchList(matchIds);
          }
        }, [matchData]);

        const parseMarkdown = (children: string) => (
          <Markdown
            className={cn(is_annotation && "a")}
            rehypePlugins={[rehypeRaw]}
            components={{
              mark(props) {
                const { node, id, ...rest } = props;
                const matchId = `${index}_${id}`;
                const color = matchId === activeId ? "#DC2626" : "#2563EB";
                return (
                  <span
                    key={index}
                    id={matchId}
                    style={{
                      backgroundColor: color,
                      color: "white",
                      display: "inline-block",
                      whiteSpace: "pre-wrap",
                    }}
                    {...rest}
                  ></span>
                );
              },
            }}
          >
            {children}
          </Markdown>
        );

        const _speech = useMemo<ReactNode>(() => {
          if (typeof matchData === "string") {
            return parseMarkdown(matchData);
          } else {
            let str = "";
            for (let i = 0; i < matchData.slices.length; i++) {
              if (i === matchData.slices.length - 1) str += matchData.slices[i];
              else
                str +=
                  matchData.slices[i] +
                  `<mark id='${i}'>${matchData.matches[i]}</mark>`;
            }
            return parseMarkdown(str);
          }
        }, [speech, keyword]);

        return (
          <>
            {!_timestamp.hasSame(prev, "hour") &&
              !_timestamp.hasSame(prev, "minute") && (
                <p className="text-zinc-500 text-center italic">{timeString}</p>
              )}
            {author === "ANNOTATION" ? (
              <div
                key={index}
                className="text-zinc-900 dark:text-white text-center italic"
              >
                {_speech}
              </div>
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
                date={date}
              >
                {_speech}
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
      {(sidebarButton) => (
        <div className="flex flex-col w-full items-center">
          <Hero>
            <div className="space-y-6 py-8 lg:py-12 xl:w-full">
              <div className="flex items-center font-medium text-sm text-zinc-500 whitespace-nowrap flex-wrap">
                <span className={styles.link_dim}>
                  {t("archive", {
                    context: cycle.house === 0 ? "dr" : "dn",
                  })}
                </span>
                <ChevronRightIcon className="h-5 w-5 text-zinc-500" />
                <span className={styles.link_dim}>
                  {t("parlimen_full", { ns: "enum", n: cycle.term })}
                </span>
                <ChevronRightIcon className="h-5 w-5 text-zinc-500" />
                <span className={styles.link_dim}>
                  {t("penggal_full", { ns: "enum", n: cycle.session })}
                </span>
                <ChevronRightIcon className="h-5 w-5 text-zinc-500" />
                <span className={styles.link_dim}>
                  {t("mesyuarat_full", { ns: "enum", n: cycle.meeting })}
                </span>
              </div>
              <div className="flex justify-between gap-3 lg:gap-6 items-center">
                <DateCard size="lg" date={date} />
                <div className="w-[calc(100%-78px)] gap-y-3 justify-center flex flex-col">
                  <h1 className="text-3xl font-bold leading-[38px] text-zinc-900 dark:text-white" data-testid="hero-header">
                    {t("header", {
                      context: cycle.house === 0 ? "dr" : "dn",
                    })}
                  </h1>
                  {counts && counts.length > 0 && (
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

              <div className="flex gap-x-4.5 gap-y-3 whitespace-nowrap flex-wrap z-50">
                <span className={styles.link_blue}>
                  <CiteIcon className="h-5 w-5" />
                  {t("cite")}
                </span>
                <At
                  external
                  href={`${process.env.NEXT_PUBLIC_DOWNLOAD_URL}${
                    filename.startsWith("dr") ? "dewanrakyat" : "dewannegara"
                  }/${filename}.pdf`}
                  onClick={() => download("pdf")}
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
                  onClick={() => download("csv")}
                  className={styles.link_blue}
                >
                  <DownloadIcon className="h-5 w-5" />
                  {t("download", { context: "csv" })}
                </At>
                <ShareButton
                  date={date}
                  hansard_id={id}
                  trigger={(onClick) => (
                    <div className={styles.link_blue} onClick={onClick}>
                      <ShareIcon className="h-5 w-5" />
                      {t("share")}
                    </div>
                  )}
                />
              </div>
            </div>
          </Hero>
          <div className="dark:border-washed-dark sticky top-14 z-20 flex items-center justify-between gap-1 lg:gap-3 w-full border-b bg-white py-1.5 dark:bg-black lg:px-8">
            <div className="flex gap-3 items-center w-full">
              <Search
                className="border-none py-[3.5px] w-full"
                query={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  onSearchChange(e.target.value);
                }}
              />

              {searchValue && searchValue.length > 0 && (
                <Button
                  variant="reset"
                  className="h-fit hover:bg-washed dark:hover:bg-washed-dark text-dim group rounded-full p-1 hover:text-black dark:hover:text-white"
                  onClick={() => onSearchChange("")}
                >
                  <XMarkIcon className="text-dim h-5 w-5 group-hover:text-black dark:group-hover:text-white" />
                </Button>
              )}
            </div>
            {searchValue && searchValue.length > 0 && (
              <div className="flex gap-3 items-center">
                <p className="text-zinc-500 max-sm:text-sm whitespace-nowrap">{`${activeCount} of ${totalCount} found`}</p>
                <Button
                  variant="reset"
                  className="h-fit hover:bg-washed dark:hover:bg-washed-dark text-dim group rounded-full p-1 hover:text-black dark:hover:text-white"
                  onClick={onPrev}
                >
                  <ChevronUpIcon className="w-5 h-5" />
                </Button>
                <Button
                  variant="reset"
                  className="h-fit hover:bg-washed dark:hover:bg-washed-dark text-dim group rounded-full p-1 hover:text-black dark:hover:text-white"
                  onClick={onNext}
                >
                  <ChevronDownIcon className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
          <div
            className={cn(
              "h-full max-w-screen-2xl px-3 md:px-4.5 lg:px-6 pt-3 pb-8 lg:py-12 bg-white dark:bg-zinc-900 gap-y-6 flex flex-col relative",
              narrowMode ? "w-[500px]" : "w-full"
            )}
          >
            <div
              className={cn(
                "hidden lg:block absolute top-2 right-40 p-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md shadow-button",
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
            {sidebarButton}
            {recurSpeech(speeches, searchValue)}
          </div>
        </div>
      )}
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
