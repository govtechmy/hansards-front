import { DateCard, Hero, Markdown } from "@components/index";
import { SidebarOpen } from "@data-catalogue/hansard/sidebar";
import MobileButton from "@data-catalogue/hansard/mobile-button";
import { ChevronRightIcon, ShareIcon } from "@heroicons/react/20/solid";
import { useAnalytics } from "@hooks/useAnalytics";
import { useTranslation } from "@hooks/useTranslation";
import { COLOR } from "@lib/constants";
import { cn, numFormat } from "@lib/helpers";
import { routes } from "@lib/routes";
import { NestedSpeech, Speech, Speeches } from "@lib/types";
import Link from "next/link";
import {
  ComponentProps,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import rehypeRaw from "rehype-raw";
import SpeechBubble from "./bubble";
import { SearchContext, SearchEventContext } from "./search/context";
import { highlightKeyword } from "./search/highlight";
import { getMatchText } from "./search/match-text";
import CiteButton from "./cite";
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

  let curr = "";
  let curr_author = "";
  let curr_dir = false;

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
        const prev = curr; // temp store
        if (curr !== ts) curr = ts;

        function formatAMPM(hrs: number, min: string) {
          const ampm = hrs >= 12 ? " PM" : " AM";
          const hours = hrs % 12 ? hrs % 12 : 12; // hour '0' should be '12'
          return hours + ":" + min + ampm;
        }
        const timeString = formatAMPM(Number(ts.slice(0, 2)), ts.slice(2));

        const time = highlightKeyword(timeString, `${speech_id}_time`);

        // Search
        if (author !== curr_author) curr_dir = !curr_dir;
        curr_author = author;
        const names = author.includes(" [") ? author.split(" [") : [author];

        const IS_YDP = [
          "Tuan Yang di-Pertua",
          "Timbalan Yang di-Pertua",
          "Tuan Pengerusi",
        ].some(ydp => author.includes(ydp));

        const mod =
          author !== "ANNOTATION" && IS_YDP
            ? "ydp"
            : author
            ? ["Beberapa Ahli", "Seorang Ahli"].includes(author)
              ? ""
              : names[0].length % 7
            : "";

        const colour = useMemo<string>(() => {
          if (mod === "ydp") return "ydp";
          switch (mod) {
            case 0:
              return "r"; // red
            case 1:
              return "o"; // orange
            case 2:
              return "g"; // green
            case 3:
              return "c"; // cyan
            case 4:
              return "b"; // blue
            case 5:
              return "v"; // violet
            case 6:
              return "p"; // pink
            default:
              return "z"; // zinc
          }
        }, [mod]);

        const speaker =
          author !== "ANNOTATION" ? (
            <p className={cn("n", colour)}>
              {highlightKeyword(names[0], `${speech_id}_title`)}
              {names[1] ? (
                <span className="o">
                  {highlightKeyword(
                    ` - ${names[1].slice(0, -1)}`,
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
            {index === 0 || prev !== ts ? <p className="t">{time}</p> : <></>}
            {author === "ANNOTATION" ? (
              <div className="a" id={`${index}`}>
                {_speech}
              </div>
            ) : (
              <SpeechBubble
                speaker={speaker}
                timeString={timeString}
                filename={hansard_url}
                index={index}
                speech_id={speech_id}
                hansard_id={hansard_id}
                date={date}
                length={speech.length}
                isYDP={IS_YDP}
                side={curr_dir}
                uid={IS_YDP ? 3304 : 3477}
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
            ref={ref => (scrollRef.current[sidebar_id] = ref)}
            className="flex scroll-mt-40 flex-col gap-3 lg:scroll-mt-28 lg:gap-6"
          >
            <p
              className={cn(
                "top-28 z-10 text-balance bg-background py-3 text-center text-foreground lg:sticky",
                // !s[heading].some((e) => !isSpeech(e)) && "lg:sticky",
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

  const parlimen_link = `${dewan_route}#parlimen-${cycle.term}`;
  const penggal_link = `${parlimen_link}-penggal-${cycle.session}`;
  const mesyuarat_link = `${penggal_link}-mesyuarat-${cycle.meeting}`;

  const hansard_url = `${process.env.NEXT_PUBLIC_DOWNLOAD_URL}${
    IS_KK ? "kamarkhas" : IS_DR ? "dewanrakyat" : "dewannegara"
  }/${filename}`;

  return (
    <Sidebar
      ref={sidebarRef}
      speeches={speeches}
      onClick={selected => {
        scrollRef.current[selected]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }}
    >
      {open => (
        <div className="relative flex w-full flex-col items-center border-r border-border">
          <Hero>
            <div className="space-y-6 py-8 lg:py-12 xl:w-full">
              <div className="flex flex-wrap items-center whitespace-nowrap text-sm font-medium text-zinc-500">
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
              <div className="flex items-center justify-between gap-3 lg:gap-6">
                <DateCard size="lg" date={date} />
                <div className="flex w-[calc(100%-78px)] flex-col justify-center gap-y-3">
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
                      className="flex flex-wrap items-center gap-1.5 whitespace-nowrap text-sm text-zinc-500"
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

              <div className="z-50 flex flex-wrap gap-x-4.5 gap-y-3 whitespace-nowrap">
                <CiteButton
                  date={date}
                  hansard_id={hansard_id}
                  dewan={IS_KK ? "KK" : IS_DR ? "DR" : "DN"}
                  trigger={onClick => (
                    <button className={styles.link_blue} onClick={onClick}>
                      <CiteIcon className="size-5" />
                      {t("cite")}
                    </button>
                  )}
                />
                <a
                  target="_blank"
                  href={`${hansard_url}.pdf`}
                  onClick={() => download("pdf")}
                  className={styles.link_blue}
                >
                  <DownloadIcon className="size-5" />
                  {t("download", { context: "pdf" })}
                </a>
                <a
                  target="_blank"
                  href={`${hansard_url}.csv`}
                  onClick={() => download("csv")}
                  className={styles.link_blue}
                >
                  <DownloadIcon className="size-5" />
                  {t("download", { context: "csv" })}
                </a>
                <ShareButton
                  date={date}
                  hansard_id={hansard_id}
                  trigger={onClick => (
                    <button className={styles.link_blue} onClick={onClick}>
                      <ShareIcon className="size-5" />
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
              "relative flex h-full flex-col gap-y-6 bg-background px-3 pb-8 pt-3 md:px-4.5 lg:max-w-[1048px] lg:px-6 lg:py-12",
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

const CiteIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.83333 2.5C3.99238 2.5 2.5 3.99238 2.5 5.83333V14.1667C2.5 16.0076 3.99238 17.5 5.83333 17.5H14.1667C16.0076 17.5 17.5 16.0076 17.5 14.1667V5.83333C17.5 3.99238 16.0076 2.5 14.1667 2.5H5.83333ZM5.83333 12.5774L5.83333 14.1667C6.61725 13.8181 7.25801 13.3581 7.75562 12.7865C8.24642 12.2219 8.61111 11.6015 8.84969 10.9253C9.08828 10.2492 9.20757 9.26635 9.20757 7.97679L9.20757 5.83333H5.83333L5.83333 9.28377H7.43865C7.43865 9.76474 7.38412 10.1969 7.27505 10.5803C7.15917 10.9707 6.99216 11.3436 6.77403 11.6991C6.5559 12.0546 6.24233 12.3473 5.83333 12.5774ZM10.7924 12.5774V14.1667C11.5695 13.8181 12.2069 13.3581 12.7045 12.7865C13.2021 12.2219 13.5702 11.6015 13.8088 10.9253C14.0474 10.2492 14.1667 9.26635 14.1667 7.97679V5.83333H10.7924V9.28377H12.3977C12.3977 9.76474 12.3432 10.1969 12.2342 10.5803C12.1183 10.9707 11.9513 11.3436 11.7331 11.6991C11.515 12.0546 11.2014 12.3473 10.7924 12.5774Z"
        fill="#2563EB"
      />
    </svg>
  );
};

const DownloadIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 2C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V16C4 16.5304 4.21071 17.0391 4.58579 17.4142C4.96086 17.7893 5.46957 18 6 18H14C14.5304 18 15.0391 17.7893 15.4142 17.4142C15.7893 17.0391 16 16.5304 16 16V7.414C15.9999 6.88361 15.7891 6.37499 15.414 6L12 2.586C11.625 2.2109 11.1164 2.00011 10.586 2H6ZM11 8C11 7.73478 10.8946 7.48043 10.7071 7.29289C10.5196 7.10536 10.2652 7 10 7C9.73478 7 9.48043 7.10536 9.29289 7.29289C9.10536 7.48043 9 7.73478 9 8V11.586L7.707 10.293C7.61475 10.1975 7.50441 10.1213 7.3824 10.0689C7.2604 10.0165 7.12918 9.9889 6.9964 9.98775C6.86362 9.9866 6.73194 10.0119 6.60905 10.0622C6.48615 10.1125 6.3745 10.1867 6.2806 10.2806C6.18671 10.3745 6.11246 10.4861 6.06218 10.609C6.0119 10.7319 5.9866 10.8636 5.98775 10.9964C5.9889 11.1292 6.01649 11.2604 6.0689 11.3824C6.12131 11.5044 6.19749 11.6148 6.293 11.707L9.293 14.707C9.48053 14.8945 9.73484 14.9998 10 14.9998C10.2652 14.9998 10.5195 14.8945 10.707 14.707L13.707 11.707C13.8892 11.5184 13.99 11.2658 13.9877 11.0036C13.9854 10.7414 13.8802 10.4906 13.6948 10.3052C13.5094 10.1198 13.2586 10.0146 12.9964 10.0123C12.7342 10.01 12.4816 10.1108 12.293 10.293L11 11.586V8Z"
        fill="#2563EB"
      />
    </svg>
  );
};
