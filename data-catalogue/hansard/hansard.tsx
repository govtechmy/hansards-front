import { DateCard, Hero, Markdown } from "@components/index";
import { SidebarOpen } from "@data-catalogue/hansard/sidebar";
import MobileButton from "@data-catalogue/hansard/mobile-button";
import { ChevronRightIcon, ShareIcon } from "@heroicons/react/20/solid";
import { useAnalytics } from "@hooks/useAnalytics";
import { useTranslation } from "@hooks/useTranslation";
import { CiteIcon, DownloadIcon } from "@icons/index";
import { COLOR } from "@lib/constants";
import { cn, numFormat } from "@lib/helpers";
import { routes } from "@lib/routes";
import { NestedSpeech, Speech, Speeches } from "@lib/types";
import Link from "next/link";
import { ReactNode, useContext, useEffect, useMemo, useRef } from "react";
import rehypeRaw from "rehype-raw";

import SpeechBubble from "./bubble";
import { SearchContext, SearchEventContext } from "./search/context";
import { highlightKeyword } from "./search/highlight";
import { getMatchText } from "./search/match-text";
import ShareButton from "./share";
import HansardSearch from "./search-bar";
import Sidebar from "./sidebar";

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
  hansard_id: string;
}

const Hansard = ({
  cycle,
  date,
  filename,
  speeches,
  hansard_id,
}: HansardProps) => {
  const { t } = useTranslation(["hansard", "enum", "common"]);
  const scrollRef = useRef<Record<string, HTMLElement | null>>({});

  const sidebarRef = useRef<SidebarOpen>(null);
  function handleClick() {
    if (sidebarRef.current) sidebarRef.current.open();
  }

  const { counts, download } = useAnalytics(hansard_id);
  const { downloads, shares, views } = counts;

  let curr = "0000";

  const recurSpeech = (speeches: Speeches, prev_id?: string): ReactNode => {
    let { searchValue } = useContext(SearchContext);
    const { onUpdateMatchList } = useContext(SearchEventContext);

    return speeches.map((s, i) => {
      const isFirstLevel = !prev_id;
      const sidebar_id = isFirstLevel ? `${i}` : `${prev_id}_${i}`;

      // Annotation, Speech, Timestamp
      if (isSpeech(s)) {
        const { author, is_annotation, index, speech, timestamp } = s;
        const speech_id = `${sidebar_id}-${index}`;

        // Timestamp
        const ts = String(timestamp);
        const hr = ts.slice(0, 2);
        const mn = ts.slice(2);

        function formatAMPM(hrs: number, min: string) {
          const ampm = hrs >= 12 ? " PM" : " AM";
          const hours = hrs % 12 ? hrs % 12 : 12; // hour '0' should be '12'
          return hours + ":" + min + ampm;
        }
        const timeString = formatAMPM(Number(hr), mn);

        const prev = curr; // temp store
        if (curr !== ts) curr = ts;

        const time =
          prev !== ts ? (
            <p className="t">
              {highlightKeyword(timeString, `${speech_id}_time`)}
            </p>
          ) : (
            <></>
          );

        // Search
        const names = author !== "ANNOTATION" ? author.split("[") : ["", ""];

        const IS_YDP = [
          "Tuan Yang di-Pertua",
          "Timbalan Yang di-Pertua",
          "Tuan Pengerusi",
        ].some((ydp) => author.includes(ydp));

        const party: string = IS_YDP ? "ydp" : "";
        const colour = useMemo<string>(() => {
          switch (party) {
            case "bn":
              return "bn";
            case "gps":
              return "gps";
            case "ph":
              return "ph";
            case "pn":
              return "pn";
            case "ydp":
              return "text-secondary";
            default:
              return "text-zinc-500";
          }
        }, [party]);

        const speaker =
          author !== "ANNOTATION" ? (
            <p className={cn("n", colour)}>
              {highlightKeyword(names[0], `${speech_id}_title`)}
              {names[1] ? (
                <span className="o">
                  {highlightKeyword(
                    `- ${names[1].slice(0, -1)}`,
                    `${speech_id}_subtitle`
                  )}
                </span>
              ) : undefined}
            </p>
          ) : (
            <></>
          );

        const matchData = useMemo(
          () =>
            searchValue && searchValue.length > 1
              ? getMatchText(
                  searchValue,
                  speech.replaceAll("*", "").replaceAll("**", "")
                )
              : speech,
          [searchValue, speech]
        );

        useEffect(() => {
          if (typeof matchData === "object") {
            const matchIds = matchData.matches.map((_, i) => ({
              id: `${speech_id}_${i}`,
              idCount: i,
            }));
            onUpdateMatchList(matchIds);
          } else onUpdateMatchList([]);
        }, [matchData]);

        const parseMarkdown = (children: string) => (
          <Markdown
            className={cn("c", is_annotation && "d")}
            rehypePlugins={[rehypeRaw]}
            disallowedElements={["code"]}
            components={{
              mark(props) {
                const { node, id, ...rest } = props;
                const matchId = `${speech_id}_${id}`;
                const { activeId } = useContext(SearchContext);
                const backgroundColor =
                  matchId === activeId ? COLOR.PRIMARY : "#DDD6B0";
                const color = matchId === activeId ? COLOR.WHITE : COLOR.BLACK;
                return (
                  <span
                    key={index}
                    id={matchId}
                    style={{
                      backgroundColor,
                      color,
                    }}
                    {...rest}
                  />
                );
              },
            }}
          >
            {children}
          </Markdown>
        );

        const _speech = useMemo<ReactNode>(() => {
          if (typeof matchData === "string") return parseMarkdown(matchData);
          else {
            let str = "";
            for (let i = 0; i < matchData.slices.length; i++) {
              if (i === matchData.slices.length - 1) str += matchData.slices[i];
              else
                str += `${matchData.slices[i]}<mark id='${i}'>${matchData.matches[i]}</mark>`;
            }
            return parseMarkdown(str);
          }
        }, [searchValue]);

        return (
          <>
            {time}
            {author === "ANNOTATION" ? (
              <div className="a" id={`${index}`}>
                {_speech}
              </div>
            ) : (
              <SpeechBubble
                speaker={speaker}
                timeString={timeString}
                index={index}
                speech_id={speech_id}
                hansard_id={hansard_id}
                date={date}
                length={speech.length}
                isYDP={IS_YDP}
              >
                {_speech}
              </SpeechBubble>
            )}
          </>
        );
      } else {
        const heading = Object.keys(s)[0];

        return (
          <div
            key={heading}
            ref={(ref) => (scrollRef.current[sidebar_id] = ref)}
            className="flex flex-col bg-background gap-y-3 lg:gap-y-6 scroll-mt-40 lg:scroll-mt-28 max-w-[1000px]"
          >
            <p
              className={cn(
                "text-foreground text-center py-3 lg:sticky top-28 bg-background z-10 text-balance",
                isFirstLevel ? "font-bold" : "font-medium"
              )}
            >
              {highlightKeyword(heading, sidebar_id)}
            </p>
            {recurSpeech(s[heading], sidebar_id)}
          </div>
        );
      }
    });
  };

  const styles = {
    link_blue: "flex gap-1 items-center text-blue-600 font-medium link",
  };

  const IS_DR = cycle.house === 0;
  const IS_KK = cycle.house === 2;
  const dewan_route = IS_KK
    ? routes.KATALOG_KK
    : IS_DR
    ? routes.KATALOG_DR
    : routes.KATALOG_DN;

  const parlimen_link = `${dewan_route}/parlimen-${cycle.term}`;
  const penggal_link = `${parlimen_link}/penggal-${cycle.session}`;
  const mesyuarat_link = `${penggal_link}/mesyuarat-${cycle.meeting}`;

  const hansard_url = `${process.env.NEXT_PUBLIC_DOWNLOAD_URL}${
    filename.startsWith("kk")
      ? "kamarkhas"
      : filename.startsWith("dr")
      ? "dewanrakyat"
      : "dewannegara"
  }/${filename}`;

  return (
    <Sidebar
      ref={sidebarRef}
      speeches={speeches}
      onClick={(selected) => {
        scrollRef.current[selected]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }}
    >
      {(open) => (
        <div className="flex flex-col w-full items-center border-r border-border relative">
          <Hero>
            <div className="space-y-6 py-8 lg:py-12 xl:w-full">
              <div className="flex items-center font-medium text-sm text-zinc-500 whitespace-nowrap flex-wrap">
                <Link href={dewan_route} className="link" prefetch={false}>
                  {t("archive", {
                    context: IS_KK ? "kk" : IS_DR ? "dr" : "dn",
                  })}
                </Link>
                <ChevronRightIcon className="h-5 w-5 text-zinc-500" />
                <Link href={parlimen_link} className="link" prefetch={false}>
                  {t("parlimen", { ns: "enum", count: cycle.term })}
                </Link>
                <ChevronRightIcon className="h-5 w-5 text-zinc-500" />
                <Link href={penggal_link} className="link" prefetch={false}>
                  {t("penggal_full", { ns: "enum", n: cycle.session })}
                </Link>
                <ChevronRightIcon className="h-5 w-5 text-zinc-500" />
                <Link href={mesyuarat_link} className="link" prefetch={false}>
                  {t("mesyuarat_full", { ns: "enum", n: cycle.meeting })}
                </Link>
              </div>
              <div className="flex justify-between gap-3 lg:gap-6 items-center">
                <DateCard size="lg" date={date} />
                <div className="w-[calc(100%-78px)] gap-y-3 justify-center flex flex-col">
                  <h1
                    className="text-3xl font-bold leading-[38px] text-foreground"
                    data-testid="hero-header"
                  >
                    {t("header", {
                      context: IS_KK ? "kk" : IS_DR ? "dr" : "dn",
                    })}
                  </h1>
                  {views >= 0 || shares >= 0 || downloads >= 0 ? (
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
                  ) : (
                    <div className="h-5 w-full" />
                  )}
                </div>
              </div>

              <div className="flex gap-x-4.5 gap-y-3 whitespace-nowrap flex-wrap z-50">
                <span className={styles.link_blue}>
                  <CiteIcon className="h-5 w-5" />
                  {t("cite")}
                </span>
                <a
                  target="_blank"
                  href={`${hansard_url}.pdf`}
                  onClick={() => download("pdf")}
                  className={styles.link_blue}
                >
                  <DownloadIcon className="h-5 w-5" />
                  {t("download", { context: "pdf" })}
                </a>
                <a
                  target="_blank"
                  href={`${hansard_url}.csv`}
                  onClick={() => download("csv")}
                  className={styles.link_blue}
                >
                  <DownloadIcon className="h-5 w-5" />
                  {t("download", { context: "csv" })}
                </a>
                <ShareButton
                  date={date}
                  hansard_id={hansard_id}
                  trigger={(onClick) => (
                    <button className={styles.link_blue} onClick={onClick}>
                      <ShareIcon className="h-5 w-5" />
                      {t("share")}
                    </button>
                  )}
                />
              </div>
            </div>
          </Hero>

          <HansardSearch />
          <div
            className={cn(
              "h-full max-w-screen-2xl px-3 md:px-4.5 lg:px-6 pt-3 pb-8 lg:py-12 bg-background gap-y-6 flex flex-col relative",
              open && "mx-auto"
            )}
          >
            <MobileButton onClick={handleClick} />
            {recurSpeech(speeches)}
          </div>
        </div>
      )}
    </Sidebar>
  );
};

export default Hansard;

export function isSpeech(_speech: Speech | NestedSpeech): _speech is Speech {
  const keys = Object.keys(_speech);
  return (
    keys.includes("speech") &&
    keys.includes("author") &&
    keys.includes("timestamp")
  );
}
